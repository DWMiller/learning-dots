import stampit from 'stampit';
import util from './util';

module.exports = stampit().props({
  moves: ['up', 'right', 'down', 'left'],
  direction: false,
}).methods({
  pickDirection() {
    this.direction = util.arrayRand(this.moves);
  },
  isFree(lookup) {
    if (!Object.hasOwnProperty.call(lookup, this.x)) {
      return true;
    }

    if (!Object.hasOwnProperty.call(lookup[this.x], this.y)) {
      return true;
    }

    return false;
  },
  move: {
    left(obj, config) {
      if (obj.x >= config.scale) {
        obj.x -= config.scale;
      }
    },
    up(obj, config) {
      if (obj.y >= config.scale) {
        obj.y -= config.scale;
      }
    },
    right(obj, config) {
      if (obj.x <= config.w - config.scale) {
        obj.x += config.scale;
      }
    },
    down(obj, config) {
      if (obj.y <= config.h - config.scale) {
        obj.y += config.scale;
      }
    },
  },
});
