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
                    'node_modules/phaser-cachebuster/build/phaser-cachebuster.d.ts'
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
            dist: {
                files: [
                    {expand: true, cwd: 'assets/images', dest: '_build/dist/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sound', dest: '_build/dist/assets/sound', src: ['**/*']},
                    {expand: true, cwd: 'assets/css', dest: '_build/dist/assets/css', src: ['**/*']},
                    {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']},
                    {expand: true, cwd: 'assets/atlas', dest: '_build/dist/assets/atlas', src: ['**/*']}
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
                        'node_modules/phaser-cachebuster/build/phaser-cachebuster.min.js',
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
            production: {
                files: [
                    {expand: true, cwd: '_build/dist', src: ['**'], dest: '<%= game.name %>/'}
                ]
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
        }
    });

    var buildNumber = grunt.option("buildNumber");
    grunt.registerTask('writeVersion', 'Creates a version file specifying the game version for cache busting', function() {
        if (undefined === buildNumber) {
            grunt.fail.warn('Cannot run without build number parameter');
        }
        grunt.file.write('_build/dist/version.js', 'version="' + buildNumber + '";'  );
    });

    /**
     * This can decrypt a databag with a given password.
     * We do this for deploy/cname registration to get the user/pass for aws/cloudflare in the simplest possible secure way
     *
     * @param databag
     * @param password
     * @returns {*}
     */
    function decryptDataBag(databag, password)
    {
        var decipher = crypto.createDecipher('aes-256-cbc', password);

        var decrypted = decipher.update(databag, 'hex');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Used for pushing the code to AWS
     */
    grunt.registerTask('deploy', "Upload the game to Amazon s3 bucket", function () {
        //Setup the required variables, get them from the commandline parameters
        var databag = grunt.option('databag'),
            password = grunt.option('password'),
            bucket = grunt.option('bucket'),
            region = grunt.option('region');

        if (undefined === databag) {
            grunt.fail.warn('Can not deploy without an databag containing a user and password');
        }

        if (undefined === password) {
            grunt.fail.warn('Can not deploy without an password to decrypt the databag');
        }

        if (undefined === bucket || undefined === region) {
            grunt.fail.warn('You didnt specify a bucket/region, so I have no idea where to upload to..');
        }

        //Decrypt the databag
        var decryptedData = null;
        try {
            decryptedData = JSON.parse(decryptDataBag(databag, password));
        } catch(e) {
            grunt.fail.warn('Unable to decrypt databag!');
        }

        if (!decryptedData.hasOwnProperty('aws')) {
            grunt.fail.warn('Databag was decrypted but has incorrect data!');
        }

        //Set the config
        grunt.config.set('aws_s3.options.accessKeyId', decryptedData.aws.user);
        grunt.config.set('aws_s3.options.secretAccessKey', decryptedData.aws.pass);
        grunt.config.set('aws_s3.options.region', region);
        grunt.config.set('aws_s3.production.options.bucket', bucket);

        //Upload to S3
        grunt.task.run('aws_s3:production')
    });

    /**
     * This Checks if a subdomain is registered at cloudflare or not, and adds it if it isn't registered
     */
    grunt.registerTask('setCname', "Set a CNAME at CloudFlare", function () {
        //Setup the required variables, get them from the commandline parameters
        var databag = grunt.option('databag'),
            password = grunt.option('password'),
            zone = grunt.option('zone'),
            location = grunt.option('location');

        if (undefined === databag) {
            grunt.fail.warn('Can not deploy without an databag containing a user and password');
        }

        if (undefined === password) {
            grunt.fail.warn('Can not deploy without an password to decrypt the databag');
        }

        if (undefined === zone) {
            grunt.fail.warn('You didnt specify a CloudFlare zone, so I have no idea where to set the CNAME record..');
        }

        if (undefined === location) {
            grunt.fail.warn('You didnt specify a location to point the CNAME record to.');
        }

        //Decrypt the databag
        var decryptedData = null;
        try {
            decryptedData = JSON.parse(decryptDataBag(databag, password));
        } catch(e) {
            grunt.fail.warn('Unable to decrypt databag!');
        }

        if (!decryptedData.hasOwnProperty('aws')) {
            grunt.fail.warn('Databag was decrypted but has incorrect data!');
        }

        //Set the config
        grunt.initConfig({
            game: grunt.file.readJSON('package.json'),
            http: {
                getCname: {
                    options: {
                        url: 'https://api.cloudflare.com/client/v4/zones/' + zone + '/dns_records?name=<%= game.name %>.fbrq.io',
                        method: 'GET',
                        headers: {
                            'X-Auth-Email': decryptedData.cloudflare.user,
                            'X-Auth-Key': decryptedData.cloudflare.pass,
                            'Content-Type': 'application/json'
                        }
                    }
                },
                setCname: {
                    options: {
                        url: 'https://api.cloudflare.com/client/v4/zones/' + zone + '/dns_records',
                        method: 'POST',
                        headers: {
                            'X-Auth-Email': decryptedData.cloudflare.user,
                            'X-Auth-Key': decryptedData.cloudflare.pass,
                            'Content-Type': 'application/json'
                        },
                        body: '{"type":"CNAME","name":"<%= game.name %>.fbrq.io","content":"' + location + '","ttl":120}'
                    }
                }
            }
        });

        grunt.config.set('http.getCname.options.callback', function (error, resp, body) {
            var data = JSON.parse(body);

            if (data.result.length === 0) {
                grunt.log.ok('No CNAME record for this game yet, adding..');
                grunt.task.run('http:setCname');
            } else {
                grunt.log.ok('CNAME record for game found, continueing without doing anything...');
            }
        });

        grunt.config.set('http.setCname.options.callback', function (error, resp, body) {
            grunt.log.ok('CNAME record for game added!');
        });


        //First we get check if the CNAME already exists
        grunt.task.run('http:getCname');
    });

    //production build, we deploy this
    grunt.registerTask('dist', [
        'clean:dist',
        'copy:dist',
        'typescript:dist',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist'
    ]);

    //Development build, used for testing. Starts filewatcher and webserver
    grunt.registerTask('dev', [
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
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-http');
    grunt.loadNpmTasks('grunt-html-build');
};
