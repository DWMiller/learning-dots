let config = {
    h: 60,
    w: 110,
    obstacleDensity: 0.05,
    cellSize: 1,
    droneCount: 5, // number of drones in 1st generation
    // droneChildCount: 3, //number of childern when spawning new generation
    // scale: 15,
    droneEnergy: 1, // starting energy of a drone
    spawnThreshold: 2,
    droneEnergyRate: 1, //rate at which a drone consumes energy
    energyRate: 0.3, // energy gained per coordinate per 'tick'
    energyMax: 1.5, //max energy capcity of a single coordinate 
    mutationRate: 1, // number of mutations on new generation
    colorSteps: 500, //variety of colour palette when using rainbow function,
    spawnRate: 70,
};
