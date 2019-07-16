const config = require('./config');

module.exports = function (grunt) {
    //Setup for OG's custom build (used internally)
    const customBuildDir = process.cwd() + '/node_modules/@azerion/grunt-custom-build/tasks';

    if (grunt.file.exists(customBuildDir)) {
        grunt.loadTasks(customBuildDir);
        config.configPath.push(customBuildDir + '/options');
    } else {
        grunt.registerTask('custom', 'Placeholder for custom build', () => {
            grunt.fail.warn('grunt-custom-build not installed, unable to create custom build');
        });
    }
};
