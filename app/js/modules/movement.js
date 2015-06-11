let movement = stampit({
    moves: ['up', 'right', 'down', 'left'],
    direction: false,
    pickDirection: function() {
        this.direction = util.arrayRand(this.moves);
    },
    isFree: function(lookup) {
        if (!lookup.hasOwnProperty(this.x)) {
            return true;
        }

        if (!lookup[this.x].hasOwnProperty(this.y)) {
            return true;
        }

        return false;
    },
    move: {
        left: function(obj) {
            if (obj.x > 0) {
                obj.x--;
            }
        },
        up: function(obj) {
            if (obj.y > 0) {
                obj.y--;
            }
        },
        right: function(obj) {
            if (obj.x < config.w) {
                obj.x++;
            }
        },
        down: function(obj) {
            if (obj.y < config.h) {
                obj.y++;
            }
        }
    }
});
