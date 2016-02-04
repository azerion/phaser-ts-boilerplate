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
                    'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.d.ts',
                    'node_modules/phaser-responsive/build/phaser-responsive.d.ts'
                ],
                noImplicitAny:true
            },
            dev: {
                src: ['ts/**/*.ts'],
                dest: '_build/dev/<%= game.name %>.js'
            },
            app: {
                src: ['tmp/**/*.ts'],
                dest: '_build/app/<%= game.name %>-<%= game.version %>.js'
            },
            dist: {
                src: ['tmp/**/*.ts'],
                dest: '_build/dist/<%= game.name %>-<%= game.version %>.js'
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
                    {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']},
                    {expand: true, cwd: 'assets/atlas', dest: '_build/dist/assets/atlas', src: ['**/*']},
                    {cwd: '', dest: '_build/dist/index.html', src: 'dist.html'}
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
                        'node_modules/phaser/dist/phaser.min.js',
                        'node_modules/ga-javascript-sdk/dist/GaJavaScriptSdk.js',
                        'node_modules/phaser-responsive/build/phaser-responsive.min.js',
                        'vendor/*.js',
                        '_build/dist/<%= game.name %>-<%= game.version %>.js'
                    ]
                },
                options: {
                    compress: {},
                    mangle: false,
                    beautify: true
                }
            }
        },
        aws_s3: {
            options: {
                region: 'eu-west-1'
            },
            production: {
                options: {
                    bucket: 'fbrq.io'
                },
                files: [
                    {expand: true, cwd: '_build/dist', src: ['**'], dest: '<%= game.name %>/'}
                ]
            }
        },
        clean: {
            dist: ['_build/dist/*'],
            app: ['_build/app/*'],
            temp: ['tmp', '_build/dist/*.js', '!_build/dist/*.min.js']
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
    grunt.loadNpmTasks('grunt-aws-s3');

    //dist Build
    grunt.registerTask('dist', [
        'env:dist',       //Set the dist environment
        'copy:preprocess',  //Setup the preprcoess folder
        'preprocess:all',   //Scan all files and modify according to preprocess
        'clean:dist',     //Clean the dist folder
        'copy:dist',      //Copy the dist assets over
        'typescript:dist',//Run typescript on the preprocessed files, for dist (client)
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

    //This is for deployments
    grunt.registerTask('deploy', "Upload the game to Amazon s3 bucket", function () {
        var key = grunt.option('key'),
            secret = grunt.option('secret');

        if (undefined === key) {
            grunt.fail.warn('Can not deploy without an aws key id');
        }

        if (undefined === secret) {
            grunt.fail.warn('Can not deploy without an aws secret key');
        }

        grunt.config.set('aws_s3.options.accessKeyId', key);
        grunt.config.set('aws_s3.options.secretAccessKey', secret);

        grunt.task.run('aws_s3:production')
    });

};
