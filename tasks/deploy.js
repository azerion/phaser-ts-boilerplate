const config = require('./config');

module.exports = function (grunt) {
    //Setup for OG's deploy scripts (used internally)
    const deployBuildDir = process.cwd() + '/node_modules/@azerion/grunt-deploy/tasks';

    if (grunt.file.exists(deployBuildDir)) {
        grunt.loadTasks(deployBuildDir);
        config.configPath.push(deployBuildDir + '/options');
    } else {
        grunt.registerTask('deploy', 'Placeholder for deploy build', () => {
            grunt.fail.warn('grunt-deploy not installed, unable to deploy game');
        });
    }
};
