import config from './src/config';
import canvasUtil from './src/canvas_util';

import obstacle from './src/obstacle/obstacle';
import spawnStamp from './src/spawner/spawner';


import util from './src/util';

require('./css/styles.css');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const state = {
  spawner: null,
  obstacles: [],
  drones: [],
};

let obstaclesLookup;
let allowedMoves;

function generateMoveMap() {
  allowedMoves = {};
  for (let x = 0; x <= config.w; x += 1) {
    allowedMoves[x] = {};
    for (let y = 0; y <= config.h; y += 1) {
      allowedMoves[x][y] = {
        up: true,
        right: true,
        down: true,
        left: true,
      };
    }
  }
}

function generateObstacles(count) {
  const obstacles = [];

  obstaclesLookup = {};

  for (let i = 0; i < count; i += 1) {
    const newObstacle = obstacle(util.randCoord(config));

    obstacles.push(newObstacle);

    if (!Object.hasOwnProperty.call(obstaclesLookup, newObstacle.x)) {
      obstaclesLookup[newObstacle.x] = {};
    }

    obstaclesLookup[newObstacle.x][newObstacle.y] = newObstacle;
  }

  return obstacles;
}

function generateDrones() {
  while (state.drones.length < config.droneCount) {
    state.drones.push(state.spawner.spawn());
  }

  return state.drones;
}

function render() {
  canvasUtil.blurClear(ctx);

  state.obstacles.forEach((obj) => {
    obj.draw(ctx, config);
  });

  state.drones.forEach((obj) => {
    obj.draw(ctx, config);
  });

  state.spawner.draw(ctx, config);
}

function startSimulation() {
  requestAnimationFrame(simulate);
}

function simulate() {
  if (state.drones.length === 0) {
    state.drones = generateDrones();
  }

  let needsCleanup = false;
  state.drones.forEach((drone) => {
    if (!drone.direction || drone.x < config.scale || drone.y < config.scale ||
      drone.x >= config.w - config.scale || drone.y >= config.h - config.scale ||
      Math.round(Math.random() * 15) === 5) {
      drone.pickDirection();
    }


    if (!allowedMoves[drone.x][drone.y][drone.direction]) {
      drone.pickDirection();
      return;
    }

    const previousX = drone.x;
    const previousY = drone.y;

    drone.move[drone.direction](drone, config);

    if (!drone.isFree(obstaclesLookup)) {
      allowedMoves[previousX][previousY][drone.direction] = false;
      drone.setDestroyed();
      needsCleanup = true;
    }
  });

  if (needsCleanup) {
    state.drones = state.drones.filter(drone => !drone.destroyed);
  }

  render();
  requestAnimationFrame(simulate);
}

config.h = Math.floor(document.body.clientHeight);// / config.scale);
config.w = Math.floor(document.body.clientWidth);// / config.scale);

canvasUtil.setCanvasSize(ctx, config);
canvasUtil.fillBackground(ctx, 'rgba(22, 31, 40,1)');

const obstacleCount = Math.floor(((config.w * config.h) / (config.scale * config.scale)) * config.obstacleDensity);

state.spawner = spawnStamp(util.randCoord(config));

state.obstacles = generateObstacles(obstacleCount);

generateMoveMap();

startSimulation();
