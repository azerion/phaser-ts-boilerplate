module.exports = {
    dev: {
        src: 'templates/index.html',
        dest: '_build/dev/index.html',
        options: {
            beautify: true,
            data: {
                // Data to pass to templates
                version: "<%= package.version %>",
                gameName: "<%= package.name %>",
                title: "<%= package.title %>",
                codeInjection: ""
            }
        }
    },
    dist: {
        src: 'templates/index.html',
        dest: '_build/dist/index.html',
        options: {
            beautify: true,
            data: {
                // Data to pass to templates
                version: "<%= package.version %>",
                gameName: "<%= package.name %>",
                title: "<%= package.title %>",
                codeInjection: ""
            }
        }
    },
    facebook: {
        src: 'templates/index.html',
        dest: '_build/dist/index.html',
        options: {
            beautify: true,
            data: {
                // Data to pass to templates
                version: "<%= package.version %>",
                gameName: "<%= package.name %>",
                title: "<%= package.title %>",
                codeInjection: ""
            }
        }
    }
};
