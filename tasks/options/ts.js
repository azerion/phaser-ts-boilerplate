module.exports = {
    tsconfig: true,
    dev: {
        src: ['ts/**/*.ts'],
        dest: '_build/dev/<%= package.name %>.min.js'
    },
    dist: {
        src: ['ts/**/*.ts'],
        dest: '_build/dist/<%= package.name %>-<%= package.version %>.js'
    }
};