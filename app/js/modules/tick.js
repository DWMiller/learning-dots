function checkDeathConditions(drone) {
    if (drone.destroyed) {
        //already destroyed and waiting to be removed
        return true;
    }

    if (drone.energy <= 0) {
        // energy depleted
        return true;
    }

    if (drone.x < 1 || drone.y < 1 || drone.x >= config.w || drone.y >= config.h) {
        //out of bounds
        return true;
    }

    if (lookupAtLocation(drone.x, drone.y, 'obstacle').length > 0) {
        return true;
    }

    return false;
}

function seedEnergy() {
    coordUtil.each(energyMap, function enerySeed(x, y) {
        if (energyMap[x][y] < config.energyMax) {
            energyMap[x][y] += config.energyRate;
        }
    })
}

function updateAverage() {
    averageAge = calcAverage(entities.drones, 'age');
}

function spawnGeneration(drones) {
    let newDrones = [];

    let eligibleDrones = filterSpawnEligibleDrones(drones)

    eligibleDrones.forEach(function spawn(drone) {
        drone.energy -= config.droneEnergy;
        let newDrone = createDrone(drone.x, drone.y);
        newDrone.generation = drone.generation + 1;

        if (newDrone.generation > generationCounter) {
            generationCounter++;
        }

        newDrone.color = util.rainbow(config.colorSteps, newDrone.generation % config.colorSteps)
        newDrone.evolve(drone.map);
        newDrones.push(newDrone);
    });

    return newDrones;
}

function deathCheck(drones) {
    let needsCleanup = false;

    drones.forEach(function deathCheckOne(drone) {
        drone.destroyed = checkDeathConditions(drone);

        if (drone.destroyed) {
            removeFromLookupTable(drone.x, drone.y, drone)
            needsCleanup = true;
            return;
        }

    });

    return needsCleanup;
}

function filterDeadDrones(drones) {
    return drones.filter(function filterDestroyed(drone) {
        return !drone.destroyed;
    })
}

function filterSpawnEligibleDrones(drones) {
    return drones.filter(function eligibleDronesFilter(drone) {
        // Get only the drones capable of spawning new drones
        return drone.energy > config.spawnThreshold;
    })
}

function droneCollisionCheck(drone) {
    let collisions = lookupAtLocation(drone.x, drone.y, 'drone'); //includes self
    if (collisions.length > 1) {
        util.arrayRand(collisions).destroyed = true;
    }
}
