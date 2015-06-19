function generateObstacles() {
    let arr = [];
    let stamp = stampit.compose(particle, obstacle);

    for (var i = 0; i < config.obstacleCount; i++) {
        let pos = coordUtil.randCoord(config.w, config.h);

        let obstacle = stamp.create({
            x: pos.x,
            y: pos.y,
        });

        arr.push(obstacle);
        pushToLookupTable(obstacle);
    };

    return arr;
}

function generateEnergyMap() {
    energyMap = {};
    for (let x = 0; x <= config.w; x++) {
        if (!energyMap.hasOwnProperty(x)) {
            energyMap[x] = {};
        }
        energyMap[x] = {};
        for (let y = 0; y <= config.h; y++) {
            energyMap[x][y] = config.energyMax;
        }
    }

    return energyMap;
}

function generateDrones() {
    let arr = [];
    for (var i = 0; i < config.droneCount; i++) {
        let pos = coordUtil.randCoord(config.w, config.h);
        let drone = createDrone(pos.x, pos.y);
        arr.push(drone);
    };

    return arr;
}

function createDrone(x, y) {
    return droneStamp.create({
        x: x,
        y: y,
        color: util.rainbow(config.colorSteps, 0) // util.randomColor()
    });
}
