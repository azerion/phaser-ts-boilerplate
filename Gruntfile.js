module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        //Get some details from the package.json
        game: grunt.file.readJSON('package.json'),
        //Configure the connect server that will be run
        connect: {
            server: {
                options: {
                    port: 8080
                }
            }
        },
        //Setup the environments
        env: {
            dev: { ENV: 'dev'  },
            dist: { ENV: 'dist' },
            partner: { ENV: 'partner' },
            app: { ENV: 'app' }
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
                    'node_modules/phaser/typescript/pixi.d.ts',
                    'node_modules/phaser/typescript/phaser.d.ts',
                    'node_modules/quartz-storage/bin/quartz-storage.d.ts',
                    'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.d.ts'
                ]
            },
            dev: {
                src: ['ts/**/*.ts'],
                dest: '_build/dev/<%= game.name %>.js'
            },
            partner: {
                src: ['tmp/**/*.ts'],
                dest: '_build/partner/<%= game.name %>-<%= game.version %>.js'
            },
            app: {
                src: ['tmp/**/*.ts'],
                dest: '_build/app/<%= game.name %>-<%= game.version %>.js'
            },
            dist: {
                src: ['tmp/**/*.ts'],
                dest: '_build/dist/<%= game.name %>-<%= game.version %>.js'
            },
            node: {
                src: [
                    'tmp/Backend/*.ts',
                ],
                dest: '_build/dist/node',
                options: {
                    module: 'commonjs'
                }
            }
        },
        preprocess: {
            all: {
                src: ['tmp/**/*.ts'],
                options: {
                    inline: true
                }
            }
        },
        copy: {
            preprocess: {
                files: [
                    {expand: true, cwd: 'ts', dest: 'tmp', src: ['**/*']}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'assets/images', dest: '_build/dist/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sound', dest: '_build/dist/assets/sound', src: ['**/*']},
                    {expand: true, cwd: 'assets/css', dest: '_build/dist/assets/css', src: ['**/*']},
                    {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']}
                ]
            },
            partner: {
                files: [
                    {expand: true, cwd: 'assets/images', dest: '_build/partner/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sound', dest: '_build/partner/assets/sound', src: ['**/*']}
                ]
            },
            app: {
                files: [
                    {expand: true, cwd: 'assets/images', dest: '_build/app/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sound', dest: '_build/app/assets/sound', src: ['**/*']}
                ]
            }
        },
        watch: {
            files: ['ts/**/*.ts', 'vendor/**/*.d.ts'],
            tasks: ['typescript:dev'],
            options: {
                livereload: true
            }
        },
        uglify: {
            options: {
                compress: {},
                mangle: true,
                beautify: false
            },
            dist: {
                files: {
                    '_build/dist/<%= game.name %>.min.js': [
                        'node_modules/quartz/bin/quartz.js',
                        'node_modules/quartz-socket/bin/quartz-socket.js',
                        'node_modules/quartz-storage/bin/quartz-storage.js',
                        'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.js',
                        '_build/dist/<%= game.name %>-<%= game.version %>.js'
                    ]
                },
                options: {
                    compress: {},
                    mangle: false,
                    beautify: true
                }
            },
            partner: {
                files: {
                    '_build/partner/<%= game.name %>-<%= game.version %>min.js': [
                        'node_modules/<%= quartz.name %>/bin/<%= quartz.name %>.min.js',
                        '_build/partner/<%= game.name %>-<%= game.version %>.js'
                    ]
                }
            }
        },
        clean: {
            dist: ['_build/dist/*'],
            partner: ['_build/partner/*'],
            app: ['_build/app/*'],
            temp: ['tmp']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');

    //dist Build
    grunt.registerTask('dist', [
        'env:dist',       //Set the dist environment
        'copy:preprocess',  //Setup the preprcoess folder
        'preprocess:all',   //Scan all files and modify according to preprocess
        'clean:dist',     //Clean the dist folder
        'copy:dist',      //Copy the dist assets over
        'typescript:dist',//Run typescript on the preprocessed files, for dist (client)
        'typescript:node',  //Run typescript on the preprocessed files, for node (server)
        'uglify:dist',    //Minify everything
        'clean:temp'        //Cleanup the preprocess folder
    ]);

    //Partner Build
    grunt.registerTask('app', [
        'env:app',          //Set the dist environment
        'copy:preprocess',  //Setup the preprcoess folder
        'preprocess:all',   //Scan all files and modify according to preprocess
        'clean:app',        //Clean the dist folder
        'copy:app',         //Copy the dist assets over
        'typescript:app',   //Run typescript on the preprocessed files, for dist (client)
        'uglify:app',       //Minify everything
        'clean:temp'        //Cleanup the preprocess folder
    ]);

    //Development build
    grunt.registerTask('dev', [
        'env:dev',          //Set the development environment
        'typescript:dev',   //Run typescript
        'connect:server',   //Start the server with live reloading
        'watch'             //Enable the file change watcher
    ]);
};
