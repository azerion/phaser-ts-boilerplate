const config = require('./config');

module.exports = function (grunt) {
    //Setup for OG's deploy scripts (used internally)
    grunt.registerTask('ts:dev', 'Placeholder for deploy build', () => {
        grunt.task.run('webpack:dev');

    });

    grunt.registerTask('ts:dist', 'Placeholder for deploy build', () => {
        grunt.task.run('webpack:dist');
    });
};