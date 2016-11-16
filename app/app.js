require('./css/styles.css')

import config from './src/config';
import canvasUtil from './src/canvas_util';
import movement from './src/movement';
import particle from './src/particle';
import util from './src/util';

function generateMoveMap() {
    allowedMoves = {};
    for (let x = 0; x <= config.w; x++) {
        allowedMoves[x] = {};
        for (let y = 0; y <= config.h; y++) {
            allowedMoves[x][y] = {
                up: true,
                right: true,
                down: true,
                left: true
            };
        }
    }
}

function generateObstacles() {
    let arr = [];
    let stamp = stampit.compose(particle);

    obstaclesLookup = {};

    for (var i = 0; i < config.obstacleCount; i++) {
        let pos = util.randCoord(config.w, config.h);

        let obstacle = stamp.create({
            x: pos.x,
            y: pos.y,
            color: '#FF0000'
        })

        arr.push(obstacle);

        if (!obstaclesLookup.hasOwnProperty(obstacle.x)) {
            obstaclesLookup[obstacle.x] = {};
        }

        obstaclesLookup[obstacle.x][obstacle.y] = obstacle;
    };

    return arr;
}

function generateDrones() {
    let stamp = stampit.compose(particle, movement);

    while (drones.length < config.droneCount) {
        let pos = util.randCoord(config.w, config.h);

        drones.push(stamp.create({
            x: pos.x,
            y: pos.y,
            color: util.randomColor()
        }));
    };

    return drones;
}

function render() {
    canvasUtil.blurClear(ctx);

    obstacles.forEach(function(obstacle) {
        obstacle.draw(ctx);
    });

    drones.forEach(function(drone) {
        drone.draw(ctx);
    });
}

function startSimulation() {
    requestAnimationFrame(simulate);
}

function simulate() {

    if (drones.length < config.droneCount) {
        drones = generateDrones();
    }

    let needsCleanup = false;
    drones.forEach(function(drone, index) {

        if (!drone.direction || drone.x < 1 || drone.y < 1 || drone.x >= config.w || drone.y >= config.h) {
            drone.pickDirection();
        }

        if (!allowedMoves[drone.x][drone.y][drone.direction]) {
            drone.pickDirection();
            return;
        }

        let tempX = drone.x,
            tempY = drone.y;

        drone.move[drone.direction](drone);

        if (!drone.isFree(obstaclesLookup)) {
            allowedMoves[tempX][tempY][drone.direction] = false;
            drone.destroyed = true;
            needsCleanup = true;
        }
    });

    if (needsCleanup) {
        drones = drones.filter(function(drone) {
            return !drone.destroyed;
        })
    }

    render();
    requestAnimationFrame(simulate);
}

function start() {
    config.h = Math.floor(document.body.clientHeight / config.scale);
    config.w = Math.floor(document.body.clientWidth / config.scale);

    canvas.width = config.w;
    canvas.height = config.h;

    obstacles = generateObstacles();
    generateMoveMap();

    if (!started) {
        startSimulation();
    }

    started = true;
}

let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    started = false,
    obstacles, obstaclesLookup, drones = [],
    allowedMoves;

start();

// var gui = new dat.GUI({
//     autoPlace: false
// });

// var customContainer = document.getElementById('gui');
// customContainer.appendChild(gui.domElement);

// gui.add(config, 'addTarget');
// gui.add(config, 'removeTarget');
// gui.add(config, 'moreLines');
// gui.add(config, 'lessLines');
// gui.add(config, 'lineWidth').min(1).step(1);
// gui.add(config, 'movingLines');
// gui.add(config, 'movingTargets');
