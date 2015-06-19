let movement = stampit({
        move: function() {
            this.x += 1 * this.vector.x;
            this.y += 1 * this.vector.y;
        },
        rotate: {
            turnLeft: function(self) {
                self.vector.rotateDeg(-90);
                self.vector.x = self.vector.x.toFixed(0);
                self.vector.y = self.vector.y.toFixed(0);
            },
            turnRight: function(self) {
                self.vector.rotateDeg(90);
                self.vector.x = self.vector.x.toFixed(0);
                self.vector.y = self.vector.y.toFixed(0);
            },
            nothing: function() {

            }
        }
    }, {
        //state
        energy: config.droneEnergy,
        vector: Victor(1, 0)
    }

    //enclosed
);
