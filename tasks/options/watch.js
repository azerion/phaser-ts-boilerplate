module.exports = {
    options: {
        livereload: true
    },
    assets: {
        files: ['assets/**/*.*'],
        tasks: ['copy:dev']
    },
    html: {
        files: ['templates/index.html'],
        tasks: ['htmlbuild:dev']
    }
};