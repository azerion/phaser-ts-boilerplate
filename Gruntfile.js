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
                    base: ['_build/dev', 'node_modules', '../../tools/phaser/dist']
                }
            }
        },
        //Typescript settings per build
        typescript: {
            options: {
                module: 'amd',
                target: 'es5',
                sourceMap: false,
                declaration: false,
                references: [
                    'vendor/*.d.ts',
                    'node_modules/phaser/typescript/phaser.d.ts',
                    'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.d.ts',
                    'node_modules/phaser-spine/build/phaser-spine.d.ts',
                    'node_modules/phaser-cachebuster/build/phaser-cachebuster.d.ts',
                    'node_modules/phaser-input/build/phaser-input.d.ts',
                    'node_modules/quartz-storage/bin/quartz-storage.d.ts',
                    'node_modules/orange-games-splash/build/orange-games-splash.d.ts'
                ],
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
                    {expand: true, cwd: 'node_modules/funny-games-splash/build/assets', dest: '_build/dev/assets', src: ['**/*']},
                    {expand: true, cwd: 'assets', dest: '_build/dev/assets', src: ['**/*']},
                    {expand: true, cwd: 'templates', dest: '_build/dev', src: ['index.html']}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'node_modules/funny-games-splash/build/assets', dest: '_build/dist/assets', src: ['**/*']},
                    {expand: true, cwd: 'assets/images', dest: '_build/dist/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sound', dest: '_build/dist/assets/sound', src: ['**/*', '!**/*.wav']},
                    {expand: true, cwd: 'assets/css', dest: '_build/dist/assets/css', src: ['**/*']},
                    {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']},
                    {expand: true, cwd: 'assets/spine', dest: '_build/dist/assets/spine', src: ['**/*']},
                    {expand: true, cwd: 'assets/atlas', dest: '_build/dist/assets/atlas', src: ['**/*']}
                ]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            typescript: {
                files: ['ts/**/*.ts', 'vendor/**/*.d.ts'],
                tasks: ['typescript:dev']
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
                        'node_modules/phaser/build/phaser.min.js',
                        'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.js',
                        'node_modules/phaser-spine/build/phaser-spine.min.js',
                        'node_modules/phaser-cachebuster/build/phaser-cachebuster.min.js',
                        'node_modules/phaser-input/build/phaser-input.min.js',
                        'node_modules/webfontloader/webfontloader.js',
                        'node_modules/quartz-storage/bin/quartz-storage.js',
                        'node_modules/orange-games-splash/build/orange-games-splash.min.js',
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

    var buildNumber = grunt.option("buildNumber");
    grunt.registerTask('writeVersion', 'Creates a version file specifying the game version for cache busting', function() {
        if (undefined === buildNumber) {
            grunt.fail.warn('Cannot run without build number parameter');
        }
        grunt.file.write('_build/dist/version.js', 'version="' + buildNumber + '";'  );
    });

    //production build, we deploy this
    grunt.registerTask('dist', [
        'tslint:dist',
        'clean:dist',
        'copy:dist',
        'typescript:dist',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist'
    ]);

    //Development build, used for testing. Starts filewatcher and webserver
    grunt.registerTask('dev', [
        'tslint:dist',
        'copy:dev',
        'typescript:dev',
        'connect:server',
        'watch'
    ]);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-tslint');
};
