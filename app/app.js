import config from './src/config';
import canvasUtil from './src/canvas_util';


import spawnStamp from './src/spawner/spawner';
import render from './src/render';

import util from './src/util';

import mapUtil from './src/map';

require('./css/styles.css');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

config.h = Math.floor(document.body.clientHeight);// / config.scale);
config.w = Math.floor(document.body.clientWidth);// / config.scale);

canvasUtil.setCanvasSize(ctx, config);
canvasUtil.fillBackground(ctx, 'rgba(11, 16, 20,1)');

const state = {
  spawner: null,
  objects: {
    drones: [],
  },

};

state.allowedMoves = mapUtil.generateMoveMap(config);

state.objects.spawner = spawnStamp(util.randCoord(config));

state.objects.obstacles = mapUtil.generateObstacles(config);
state.obstaclesLookup = mapUtil.generateLookupMap(state.objects.obstacles);

function simulate() {
  if (state.objects.drones.length === 0) {
    state.objects.drones = state.objects.spawner.spawnMultiple(config.droneCount);
  }

  let needsCleanup = false;
  state.objects.drones.forEach((drone) => {
    if (!drone.direction || drone.x < config.scale || drone.y < config.scale ||
      drone.x >= config.w - config.scale || drone.y >= config.h - config.scale) {
      drone.pickDirection();
    }


    if (!state.allowedMoves[drone.x][drone.y][drone.direction]) {
      drone.pickDirection();
      return;
    }

    const previousX = drone.x;
    const previousY = drone.y;

    drone.move[drone.direction](drone, config);

    if (!drone.isFree(state.obstaclesLookup)) {
      state.allowedMoves[previousX][previousY][drone.direction] = false;
      drone.setDestroyed();
      needsCleanup = true;
    }
  });

  if (needsCleanup) {
    state.objects.drones = state.objects.drones.filter(drone => !drone.destroyed);
  }

  render(ctx, state.objects);


  requestAnimationFrame(simulate);
}

simulate();
