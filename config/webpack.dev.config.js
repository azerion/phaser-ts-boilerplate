'use strict';

const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require(
    'fork-ts-checker-notifier-webpack-plugin');
const HappyPack = require('happypack');
const config = require('../package.json');

let webpackConfig = require('./webpack.base.config.js');

const basePath = path.join(__dirname, '../');
module.exports = function() {
    let myDevConfig = webpackConfig;

    myDevConfig.devtool = 'inline-source-map';
    myDevConfig.cache = true;
    myDevConfig.watch = true;

    myDevConfig.output = {
        path: path.join(basePath), //, '_build/dev'),
        filename: 'game.js',
    };
    myDevConfig.plugins = myDevConfig.plugins.concat([
        new webpack.DefinePlugin({
            'DEBUG': true,
            'version': Date.now(),
            'libs': JSON.stringify([
                'node_modules/@orange-games/phaser-cachebuster/build/phaser-cachebuster.js',
                'node_modules/@orange-games/phaser-spine/build/phaser-spine.js',
                'node_modules/@orange-games/phaser-ads/build/phaser-ads.min.js',
                'node_modules/@orange-games/phaser-super-storage/build/phaser-super-storage.min.js',
                'node_modules/@orange-games/splash/build/splash.js'
            ])
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            proxy: 'http://localhost:8080',
        }),
        new HappyPack({
            id: 'ts',
            verbose: false,
            threads: 2,
            loaders: [
                'cache-loader',
                {
                    path: 'ts-loader',
                    query: {happyPackMode: true},
                },
            ],
        }),
        new ForkTsCheckerNotifierWebpackPlugin({alwaysNotify: true}),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.join(__dirname, 'tslint.json'),
            tsconfig: path.join(__dirname, 'tsconfig.json'),
        }),
    ]);

    return myDevConfig;
};