module.exports = {
    options: {
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
        },
        mangle: true
    },
    dist: {
        src: '<%= partialBuild %>',
        dest: '_build/dist/<%= package.name %>.min.js'
    }
};
