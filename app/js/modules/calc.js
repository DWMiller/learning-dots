function calcAverage(drones, field) {
    let sum = 0;

    drones.forEach(function(drone) {
        sum += drone[field];
    })

    return sum / drones.length;
}