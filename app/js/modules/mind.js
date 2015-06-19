let mind = stampit({
    //methods
    choices: ['turnRight', 'nothing', 'turnLeft'],
    nextDecision: function() {
        if (this.map.length == 0) {
            this.expand();
        }

        if (this.currentPosition >= this.map.length) {
            this.currentPosition = 0;
        }

        return this.map[this.currentPosition++];
    },
    expand: function() {
        this.map.push(util.arrayRand(this.choices));
    },
    mutate: function() {
        let mutations = config.mutationRate;
        while (mutations--) {
            this.map[util.arrayRandIndex(this.map)] = util.arrayRand(this.choices);
        }
    },
    evolve: function(map) {

        this.map = util.arrayCopy(map);

        let increaseComplexity = (Math.random() * this.map.length > this.map.length - 1);
        // console.log(Math.random() * this.map.length, this.map.length - 1);

        if (!increaseComplexity) {
            this.mutate();
        } else {
            // console.log('Expanding', this.map.length);
            this.expand()
        }
    }
}, {
    map: [],
    currentPosition: 0
});
