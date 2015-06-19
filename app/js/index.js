function render() {
    canvasUtil.blurClear(ctx);
    // canvasUtil.clear(ctx);

    // Split up canvas or add logic to not redraw static items
    for (var type in entities) {
        if (entities.hasOwnProperty(type)) {
            entities[type].forEach(obj => obj.draw(ctx));
        }
    }
}

function startSimulation() {
    requestAnimationFrame(simulate);
}

function simulate() {
    seedEnergy();

    entities.drones.forEach(droneCollisionCheck); //fatal, do something better

    if (deathCheck(entities.drones)) {
        entities.drones = filterDeadDrones(entities.drones);
    }

    let newDrones = spawnGeneration(entities.drones);

    entities.drones.forEach(function movement(drone, index) {

        let choice = drone.lookup(drone.x, drone.y);

        if (!choice) {
            choice = drone.mutate(drone.x, drone.y);
        }

        let availableEnergy = energyMap[drone.x][drone.y];
        energyMap[drone.x][drone.y] = 0;
        drone.energy += (availableEnergy - config.droneEnergyRate);

        drone.rotate[choice](drone);

        let oldX = drone.x,
            oldY = drone.y;
        drone.move();
        repositionInLookupTable(drone, oldX, oldY);

        drone.age++;
    });

    if (newDrones.length > 0) {
        newDrones.forEach(pushToLookupTable);
        entities.drones = entities.drones.concat(newDrones);
    }

    droneCounter = entities.drones.length;

    render();
    requestAnimationFrame(simulate);
}

function start() {
    entities = {};

    canvas.width = config.w;
    canvas.height = config.h;

    config.obstacleCount = Math.floor(config.w * config.h * config.obstacleDensity);

    generationCounter = 0;

    lookupTable = generateLookupTable(config.w, config.h);

        entities.obstacles = generateObstacles();
    

    energyMap = generateEnergyMap();
    entities.drones = [].concat(generateDrones());

    entities.drones.forEach(pushToLookupTable);

    if (!started) {
        startSimulation();
    }

    started = true;
}

let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    started = false,
    entities,
    energyMap, lookupTable;

let generationCounter = 0,
    droneCounter = 0;

let droneStamp = stampit.compose(particle, drone, mind, movement);

setupGui();

start();
