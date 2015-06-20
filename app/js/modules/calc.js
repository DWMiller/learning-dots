function calcAverage(objArr, field) {
    let sum = 0;

    objArr.forEach(function(drone) {
        sum += drone[field];
    })

    return sum / objArr.length;
}

function calcHighest(objArr, field) {
    return Math.max.apply(Math, objArr.map(function(o) {
        return o[field];
    }));
}
