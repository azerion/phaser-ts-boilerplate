module.exports = {
    dev: {
        src: ['_build/dev/<%= package.name %>.min.js'],
        overwrite: true,
        replacements: [{
            from: 'phaserAdProvider',
            to: 'new PhaserAds.AdProvider.GameDistributionAds(this.game,\'<%= package.gameId %>\')'
        }]
    },
    gd: {
        src: ['_build/dist/<%= package.name %>.min.js'],
        overwrite: true,
        replacements: [{
            from: 'phaserAdProvider',
            to: 'new PhaserAds.AdProvider.GameDistributionAds(this.game,\'<%= package.gameId %>\')'
        }]
    }
};