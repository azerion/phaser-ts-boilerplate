const getEnvVar = require('./tasks/getEnvVar');
const config = require('./tasks/config');

module.exports = function (grunt) {
    grunt.loadTasks('./tasks');

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, config);

    //production build, we deploy this
    grunt.registerTask('dist', [
        //'tslint:dist',
        'clean:dist',
        'copy:dist',
        'ts:dist',
        // 'obfuscator:dist',s
        'replace:gd',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist',
        'writeVersion'
    ]);

    //Development build, used for testing. Starts filewatcher and webserver
    grunt.registerTask('dev', [
        //'tslint:dist',
        'copy:dev',
        'replace:dev',
        'htmlbuild:dev',
        'connect:server',
        'concurrent:dev'
    ]);
};
