module.exports = {
    dev: {
        files: [
            {expand: true, cwd: 'assets', dest: '_build/dev/assets', src: ['**/*']},
        ]
    },
    dist: {
        files: [
            {expand: true, cwd: 'assets/images', dest: '_build/dist/assets/images', src: ['**/*']},
            {expand: true, cwd: 'assets/sound', dest: '_build/dist/assets/sound', src: ['**/*', '!**/*.wav']},
            {expand: true, cwd: 'assets/css', dest: '_build/dist/assets/css', src: ['**/*']},
            {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']},
            {expand: true, cwd: 'assets/spine', dest: '_build/dist/assets/spine', src: ['**/*']},
            {expand: true, cwd: 'assets/atlases', dest: '_build/dist/assets/atlases', src: ['**/*']}
        ]
    }
};