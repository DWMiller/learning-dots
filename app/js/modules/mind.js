let mind = stampit({
    //methods
    // choices: ['up', 'right', 'down', 'left'],
    choices: ['right', 'straight', 'left'],

    lookup: function(x, y) {

        if (!this.map.hasOwnProperty(x)) {
            return false;
        }

        if (!this.map[x].hasOwnProperty(y)) {
            return false;
        }

        return this.map[x][y];

    },
    set: function(x, y, choice) {
        if (!this.map.hasOwnProperty(x)) {
            this.map[x] = {};
        }

        if (!this.map[x].hasOwnProperty(y)) {
            this.complexity++;
        }

        this.map[x][y] = choice;

    },
    mutate: function(x, y) {
        this.set(x, y, util.arrayRand(this.choices));

        return this.map[x][y];
    },
    evolve: function(map) {
        // copy an existing map and randomly alter some choices
        this.map = util.deepCopy(map);

        //Randomly select col then row within col
        // let mutations = Math.ceil(this.complexity * config.mutationRate);
        // let cols = Object.keys(this.map);
        // while (mutations > 0) {
        //     let x = util.arrayRand(cols);
        //     let col = this.map[x];
        //     let rows = Object.keys(col);
        //     let y = util.arrayRand(rows);
        //     this.mutate(x, y);
        //     mutations--;
        // }

        // loop through all coordinates, randomly trigger on some
        let self = this;
        coordUtil.each(this.map, function(x, y) {
            // This scales badly with more drones and more complex drones
            if (Math.random() <= config.mutationRate) {
                self.mutate(x, y);
            }
        })
    }
}, {
    map: {},
    complexity: 0,
});
