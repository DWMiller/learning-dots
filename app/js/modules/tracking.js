function generateLookupTable(w, h) {
    let table = {};
    for (let x = 0; x <= w; x++) {
        if (!table.hasOwnProperty(x)) {
            table[x] = {};
        }
        for (let y = 0; y <= h; y++) {
            table[x][y] = [];
        }
    }
    return table;
}

function pushToLookupTable(obj) {
    lookupTable[obj.x][obj.y].push(obj);
}

function removeFromLookupTable(x, y, obj) {
    let index = lookupTable[x][y].indexOf(obj);
    lookupTable[x][y] = util.arrayRemove(lookupTable[x][y], index);
}

function repositionInLookupTable(obj, oldX, oldY) {
    removeFromLookupTable(oldX, oldY, obj);
    pushToLookupTable(obj);
}

function lookupAtLocation(x, y, type) {
    let collisions = lookupTable[x][y];
    if (collisions.length > 0) {
        collisions = collisions.filter(function(obj) {
            return ((typeof obj.type !== 'undefined') && (obj.type === type));
        });
    }

    return collisions;
}
