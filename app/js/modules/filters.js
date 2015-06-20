
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