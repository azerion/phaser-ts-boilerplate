const buildFiles = [
    'node_modules/@azerion/phaser/build/phaser.min.js',
    'node_modules/@azerion/phaser-i18next/build/phaser-i18next.min.js',
    'node_modules/webfontloader/webfontloader.js',
    '_build/dist/<%= package.name %>.min.js'
];

module.exports = {
    jitGrunt: {
        // here you can pass options to jit-grunt (or just jitGrunt: true)
        staticMappings: {
            htmlbuild: 'grunt-html-build',
            replace: 'grunt-text-replace',
            webpackserver: 'webpack-dev-server'
        }
    },
    configPath: [
        process.cwd() + '/tasks/options'
    ],
    config: {
        //Get some details from the package.json
        partialBuild: buildFiles,
        fullBuild: buildFiles.concat([
            'node_modules/@azerion/phaser-ads/build/phaser-ads.min.js',
            'node_modules/@azerion/phaser-spine/build/phaser-spine.min.js',
            'node_modules/@azerion/phaser-super-storage/build/phaser-super-storage.min.js',
            'node_modules/@azerion/phaser-cachebuster/build/phaser-cachebuster.min.js',
            'node_modules/@azerion/phaser-nineslice/build/phaser-nineslice.min.js',
            'node_modules/@azerion/phaser-i18next/build/phaser-i18next.min.js',
            'node_modules/@azerion/splash/build/splash.min.js'
        ]),
        ads: {
            pandoraId: 'gd_',
            cheetahId: 'gamekey_azerion_'
        }
    },
    init: true
};
