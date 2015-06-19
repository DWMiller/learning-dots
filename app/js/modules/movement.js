let movement = stampit({
        move: function() {
            this.x += 1*this.vector.x;
            this.y += 1*this.vector.y;
        },
        rotate: {
            left: function(self) {
                self.vector.rotateDeg(-90);
                self.vector.x = self.vector.x.toFixed(0);
                self.vector.y = self.vector.y.toFixed(0);
            },
            right: function(self) {
                self.vector.rotateDeg(90);
                self.vector.x = self.vector.x.toFixed(0);
                self.vector.y = self.vector.y.toFixed(0);
            },
            straight: function() {

            }
        }
    }, {
        //state
        energy: config.droneEnergy,
        vector: Victor(1, 0)
    }

    //enclosed
);
