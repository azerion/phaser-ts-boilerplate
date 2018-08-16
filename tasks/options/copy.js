module.exports = {
    dev: {
        files: [
            {expand: true, cwd: 'assets', dest: '_build/dev/assets', src: ['**/*']}
        ]
    },
    dist: {
        files: [
            {expand: true, cwd: 'assets', dest: '_build/dist/assets', src: ['**/*']}
        ]
    }
};