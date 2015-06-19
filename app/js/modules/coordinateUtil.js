let coordUtil = {
    randCoord: function(maxX, maxY) {
        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        }
    },
    each: function(map, func) {
        for (var x in map) {
            if (map.hasOwnProperty(x)) {
                for (var y in map[x]) {
                    if (map[x].hasOwnProperty(y)) {
                        func(x, y);
                    }
                }
            }
        }
    }

};
