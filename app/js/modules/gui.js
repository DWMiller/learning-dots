function setupGui() {
    let gui = new dat.GUI({
        autoPlace: false
    });

    let customContainer = document.getElementById('gui');
    customContainer.appendChild(gui.domElement);

    let environmentFolder = gui.addFolder('Environment');
    environmentFolder.add(config, 'w').name('Width');
    environmentFolder.add(config, 'h').name('Height');
    environmentFolder.add(config, 'obstacleDensity').step(0.01).min(0).max(1);

    let droneFolder = gui.addFolder('Drones');
    // droneFolder.add(config, 'droneChildCount');
    droneFolder.add(config, 'mutationRate').min(0.001).max(1).step(0.01);
    droneFolder.add(config, 'droneEnergyRate').name('Energy Usage').min(0.5);
    droneFolder.add(config, 'spawnThreshold').name('Spawn Threshold').step(1).min(1);
    droneFolder.add(config, 'droneEnergy').name('Starting Energy').step(1);
    droneFolder.add(config, 'spawnRate').name('Spawn Rate').step(1);

    let energyFolder = gui.addFolder('Energy');
    energyFolder.add(config, 'energyRate').min(0.1).step(0.05);
    energyFolder.add(config, 'energyMax').step(0.1);

    let statsFolder = gui.addFolder('Stats');
    statsFolder.add(window, 'generationCounter').name('Generations').listen();
    statsFolder.add(window, 'droneCounter').name('Active Drones').listen();
    statsFolder.open();

    gui.add(window, 'start');

}
