'use strict';

const webpack = require('webpack');
const path = require('path');
const basePath = path.join(__dirname, '../../');
const config = require(path.join(basePath, 'package.json'));

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require(
    'fork-ts-checker-notifier-webpack-plugin');
const HappyPack = require('happypack');

let webpackConfig = require('./base.config.js');

module.exports = function() {
    let myDevConfig = webpackConfig;

    myDevConfig.devtool = 'inline-source-map';
    myDevConfig.cache = true;
    myDevConfig.watch = true;
    myDevConfig.mode = 'development';

    myDevConfig.output = {
        path: path.join(basePath, '_build/dev'),
        filename: config.name + '.min.js'
    };
    myDevConfig.resolve.alias['adProvider'] = path.join(basePath,'node_modules/@azerion/phaser/build/custom/phaser-split.js');
    myDevConfig.plugins = myDevConfig.plugins.concat([
        new webpack.DefinePlugin({
            'DEBUG': true,
            'phaserAdProvider': 'new PhaserAds.AdProvider.GameDistributionAds(this.game,\'<%= package.gameId %>\')'
        }),
        new HappyPack({
            id: 'ts',
            loaders: [
                'cache-loader',
                {
                    path: 'ts-loader',
                    query: {happyPackMode: true}
                }
            ]
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.join(basePath, 'tslint.json'),
            tsconfig: path.join(basePath, 'tsconfig.json')
        }),
        new ForkTsCheckerNotifierWebpackPlugin({alwaysNotify: true})
    ]);

    return myDevConfig;
};
