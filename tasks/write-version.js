const getEnvVar = require('./getEnvVar');

module.exports = function (grunt) {
    function createURL(name, version) {
        return 'https://cdn.jsdelivr.net/npm/@azerion/' +
            name +
            '@' +
            version +
            '/build/' +
            name +
            '.min.js'
    }

    function getPkgInfo() {

        var pkgObj = grunt.config.get('package.dependencies');
        var ogMarker = '@azerion/';
        var newPkgList = [];
        for(var key in pkgObj){
            if(pkgObj.hasOwnProperty(key)){
                if(key.indexOf(ogMarker) !== -1){
                    var index = key.indexOf(ogMarker) + ogMarker.length;
                    var newKey = key.slice(index, key.length);
                    var newValue = null;
                    if (pkgObj[key].indexOf('git') !== -1){
                        newValue = pkgObj[key].slice(-5, -2);
                    } else {
                        newValue = pkgObj[key].slice(1, 4);
                    }
                    newPkgList.push(createURL(newKey, newValue));
                }
            }
        }
        return newPkgList;
    }

    let buildNumber = getEnvVar('version', 'fix-this');
    grunt.registerTask('writeVersion', 'Creates a version file specifying the game version for cache busting', function() {
        if (undefined === buildNumber) {
            grunt.fail.warn('Cannot run without build number parameter');
        }

        var pkgList = getPkgInfo();
        var pkgStr = 'libs=' + JSON.stringify(pkgList) + ';';
        var versionStr = 'version="' + buildNumber + '";';
        grunt.file.write('_build/dist/version.js', versionStr + '\n' +  pkgStr );
    });
};
