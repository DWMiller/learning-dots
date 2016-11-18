/* eslint-disable no-param-reassign*/

import aRandomColor from 'randomcolor';

module.exports = {
  randomColor() {
    return aRandomColor({
      luminosity: 'bright',
    });
  },
  randCoord({ w, h, scale }) {
    return {
      x: Math.floor(Math.random() * (w / scale)) * scale,
      y: Math.floor(Math.random() * (h / scale)) * scale,
    };
  },
  arrayRand(arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  },
};
