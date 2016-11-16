import stampit from 'stampit';
import particleStamp from './../particle/particle';
import droneStamp from './../drone/drone';

import util from './../util';

module.exports = stampit()
.compose(particleStamp)
.methods({
  spawn() {
    return droneStamp({
      x: this.x,
      y: this.y,
      color: util.randomColor(),
    });
  },
})
.props({
  type: 'spawner',
  color: '#FFFFFF',
});
