module.exports = {
    js: {
        files: ['app/js/**/*.js'],
        tasks: ['concat', 'babel']
    },
    html: {
        files: ['app/index.html'],
        tasks: ['copy']
    },
    sass: {
        files: ['app/sass/**/*'],
        tasks: ['sass']
    },
    grunt: {
        files: ['grunt/**/*'],
        tasks: [],
        options: {
            spawn: false,
            reload: true
        }
    }
}
