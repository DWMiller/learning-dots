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
    stats.averageAge = calcAverage(entities.drones, 'age');
}

function updateHighest() {
    stats.highestAge = calcHighest(entities.drones, 'age');
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


function droneCollisionCheck(drone) {
    if (drone.destroyed) {
        return;
    }

    let collisions = lookupAtLocation(drone.x, drone.y, 'drone'); //includes self

    if (collisions.length > 1) {

        let highest = 0,
            lowest = 0;

        for (let i = 0; i < collisions.length; i++) {
            if (collisions[i].age > collisions[highest].age) {
                highest = i;
            }

            if (collisions[i].age < collisions[lowest].age) {
                lowest = i;
            }
        };


        collisions[lowest].destroyed = true;
        collisions[highest].energy += collisions[lowest].energy;

    }
}
