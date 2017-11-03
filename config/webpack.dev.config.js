const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require(
    'fork-ts-checker-notifier-webpack-plugin');
const HappyPack = require('happypack');
let webpackConfig = require('./webpack.base.config.js');

const basePath = path.join(__dirname, '../');
module.exports = function() {
    let myDevConfig = webpackConfig;
    myDevConfig.devtool = 'inline-source-map';

    myDevConfig.plugins = myDevConfig.plugins.concat([
        new webpack.DefinePlugin({
            'DEBUG': true,
            'version': Date.now(),
        }),
        new CleanWebpackPlugin([
            path.join(basePath, '_build/dev'),
        ]),
        new HtmlWebpackPlugin({
            title: 'DEV MODE: Phaser NPM Webpack TypeScript Starter Project!',
            template: path.join(basePath, 'templates/index.ejs'),
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