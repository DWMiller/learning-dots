module.exports = {
    dist: {
        files: [
            // includes files within path and its sub-directories
            {
                cwd: 'app',
                expand: true,
                src: ['index.html'],
                dest: 'dist/'
            }
        ]
    }
};
