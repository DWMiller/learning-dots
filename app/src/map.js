import obstacle from './obstacle/obstacle';
import util from './util';

const api = {
  generateMoveMap({ w, h }) {
    const allowedMoves = {};
    for (let x = 0; x <= w; x += 1) {
      allowedMoves[x] = {};
      for (let y = 0; y <= h; y += 1) {
        allowedMoves[x][y] = {
          up: true,
          right: true,
          down: true,
          left: true,
        };
      }
    }
    return allowedMoves;
  },
  generateObstacles(config) {
    const obstacleCount = Math.floor(((config.w * config.h) / (config.scale * config.scale)) * config.obstacleDensity);

    const obstacles = [];

    for (let i = 0; i < obstacleCount; i += 1) {
      obstacles.push(obstacle(util.randCoord(config)));
    }

    return obstacles;
  },
  generateLookupMap(obstacles) {
    return obstacles.reduce((map, obj) => {
      if (!Object.hasOwnProperty.call(map, obj.x)) {
        map[obj.x] = {};
      }

      map[obj.x][obj.y] = obstacle;

      return map;
    }, {});
  },
};

export default api;
