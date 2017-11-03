'use strict';

const webpack = require('webpack');
const path = require('path');
const config = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basePath = path.join(__dirname, '../');

module.exports = {
    entry: path.join(basePath, 'ts/app.ts'),
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pixi: path.join(basePath,
                'node_modules/phaser/build/custom/pixi.js'),
            phaser: path.join(basePath,
                'node_modules/phaser/build/custom/phaser-split.js'),
            p2: path.join(basePath, 'node_modules/phaser/build/custom/p2.js'),
            assets: path.join(basePath, 'assets/'),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            // Do not modify these manually, you may break things...
            'GAME_WIDTH': 1280,
            'GAME_HEIGHT': 720,
            'GA_GAME_KEY': JSON.stringify('64512ec40a7abc77a9e10de091ac9d6a'),
            'GA_SECRET_KEY': JSON.stringify('a5a926b1a0f140b149e20f2e206ccd03cdf0179a'),
            'GOOGLE_ID': JSON.stringify('UA-78960661-2'),
            'GOOGLE_APP_NAME': JSON.stringify('Boilerplate'),
            'GAMEDISTRIBUTION_ID': JSON.stringify(config.gameId),
            'GAMEDISTRIBUTION_USER': JSON.stringify('ABD36C6C-E74B-4BA7-BE87-0AB01F98D30D-s1'),
        }),
        new HtmlWebpackPlugin({
            title: config.title,
            hash: true,
            template: path.join(basePath, 'templates/index.ejs'),
        }),
    ],
    module: {
        rules: [
            {
                test: /assets(\/|\\)/,
                loader: 'file-loader?name=assets/[hash].[ext]',
            },
            {
                test: /pixi\.js$/,
                loader: 'expose-loader?PIXI',
            },
            {
                test: /phaser-split\.js$/,
                loader: 'expose-loader?Phaser',
            },
            {
                test: /p2\.js$/,
                loader: 'expose-loader?p2',
            },
            {
                test: /\.ts$/,
                loader: 'happypack/loader?id=ts',
                exclude: '/node_modules/',
            }
        ],
    },
};
