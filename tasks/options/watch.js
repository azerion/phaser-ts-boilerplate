module.exports = {
    options: {
        livereload: true
    },
    typescript: {
        files: ['ts/**/*.ts', 'vendor/**/*.d.ts'],
        tasks: ['ts:dev', 'replace:dev']
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