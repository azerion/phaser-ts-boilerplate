var crypto = require('crypto');

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        //Get some details from the package.json
        game: grunt.file.readJSON('package.json'),
        //Configure the connect server that will be run
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: ['_build/dev', 'node_modules']
                }
            }
        },
        //Typescript settings per build
        ts: {
            options: {
                module: 'amd',
                target: 'es5',
                sourceMap: false,
                declaration: false,
                noImplicitAny:true
            },
            dev: {
                src: ['ts/**/*.ts'],
                dest: '_build/dev/<%= game.name %>.js'
            },
            dist: {
                src: ['ts/**/*.ts'],
                dest: '_build/dist/<%= game.name %>-<%= game.version %>.js'
            }
        },
        copy: {
            dev: {
                files: [
                    {expand: true, cwd: 'assets', dest: '_build/dev/assets', src: ['**/*']},
                    {expand: true, cwd: 'templates', dest: '_build/dev', src: ['index.html']}
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
        },
        watch: {
            options: {
                livereload: true
            },

            ts: {
                files: ['ts/**/*.ts', 'vendor/**/*.d.ts'],
                tasks: ['ts:dev']
            },
            assets: {
                files: ['assets/**/*.*', 'templates/index.html'],
                tasks: ['copy:dev']
            }
        },
        uglify: {
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
                files: {
                    '_build/dist/<%= game.name %>.min.js': [
                        'node_modules/es6-promise-polyfill/promise.min.js',
                        'node_modules/phaser/build/phaser.min.js',
                        'node_modules/webfontloader/webfontloader.js',
                        '_build/dist/<%= game.name %>-<%= game.version %>.js'
                    ]
                }
            }
        },
        clean: {
            dist: ['_build/dist/*'],
            temp: ['_build/dist/*.js', '!_build/dist/*.min.js']
        },
        htmlbuild: {
            dist: {
                src: 'templates/dist.html',
                dest: '_build/dist/index.html',
                options: {
                    data: {
                        // Data to pass to templates
                        version: "<%= game.version %>",
                        gameName: "<%= game.name %>",
                        title: "<%= game.title %>"
                    }
                }
            }
        },
        tslint: {
            options: {
                // can be a configuration object or a filepath to tslint.json
                configuration: "./tslint.json"
            },
            dist: {
                src: [
                    'ts/**/*.ts'
                ]
            }
        }
    });

    function createURL(name, version){
        return 'https://cdn.jsdelivr.net/npm/@orange-games/' +
            name +
            '@' +
            version +
            '/build/' +
            name +
            '.min.js'
    }

    function getPkgInfo(){
        console.log('running get pkg info');

        var pkgObj = grunt.config.get('game.dependencies');
        var ogMarker = '@orange-games/';
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

    var buildNumber = grunt.option("buildNumber");
    grunt.registerTask('writeVersion', 'Creates a version file specifying the game version for cache busting', function() {
        if (undefined === buildNumber) {
            grunt.fail.warn('Cannot run without build number parameter');
        }

        var pkgList = getPkgInfo();
        var pkgStr = 'libs=' + JSON.stringify(pkgList) + ';';
        var versionStr = 'version="' + buildNumber + '";';
        grunt.file.write('_build/dist/version.js', versionStr + '\n' +  pkgStr );
    });

    //production build, we deploy this
    grunt.registerTask('dist', [
        'tslint:dist',
        'clean:dist',
        'copy:dist',
        'ts:dist',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist'
    ]);

    //Development build, used for testing. Starts filewatcher and webserver
    grunt.registerTask('dev', [
        'tslint:dist',
        'copy:dev',
        'ts:dev',
        'connect:server',
        'watch'
    ]);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
};
