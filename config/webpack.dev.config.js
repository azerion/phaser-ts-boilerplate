const os = require('os');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const HappyPack = require('happypack');

const basePath = path.join(__dirname, '../');
module.exports = {
    entry: path.join(basePath, 'ts/app.ts'),
    cache: true,
    watch: true,
    output: {
        path: path.join(basePath), //, '_build/dev'),
        filename: 'game.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pixi: path.join(basePath, 'node_modules/phaser/build/custom/pixi.js'),
            phaser: path.join(basePath, 'node_modules/phaser/build/custom/phaser-split.js'),
            p2: path.join(basePath, 'node_modules/phaser/build/custom/p2.js'),
            assets: path.join(basePath, 'assets/')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'DEBUG': true,
            // Do not modify these manually, you may break things...
            'DEFAULT_GAME_WIDTH': /*[[DEFAULT_GAME_WIDTH*/800/*DEFAULT_GAME_WIDTH]]*/,
            'DEFAULT_GAME_HEIGHT': /*[[DEFAULT_GAME_HEIGHT*/500/*DEFAULT_GAME_HEIGHT]]*/,
            'MAX_GAME_WIDTH': /*[[MAX_GAME_WIDTH*/888/*MAX_GAME_WIDTH]]*/,
            'MAX_GAME_HEIGHT': /*[[MAX_GAME_HEIGHT*/600/*MAX_GAME_HEIGHT]]*/,
            'SCALE_MODE': JSON.stringify(/*[[SCALE_MODE*/'USER_SCALE'/*SCALE_MODE]]*/),
            // The items below most likely the ones you should be modifying
            'GOOGLE_WEB_FONTS': JSON.stringify([ // Add or remove entries in this array to change which fonts are loaded
                'Barrio'
            ]),
            'SOUND_EXTENSIONS_PREFERENCE': JSON.stringify([ // Re-order the items in this array to change the desired order of checking your audio sources (do not add/remove/modify the entries themselves)
                'webm', 'ogg', 'm4a', 'mp3', 'aac', 'ac3', 'caf', 'flac', 'mp4', 'wav'
            ])
        }),
        new CleanWebpackPlugin([
            path.join(basePath, '_build/dev')
        ]),
        new HtmlWebpackPlugin({
            title: 'DEV MODE: Phaser NPM Webpack TypeScript Starter Project!',
            template: path.join(basePath, 'templates/index.ejs')
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            proxy: 'http://localhost:8080'
        }),
        new HappyPack({
            id: 'ts',
            verbose: false,
            threads: 2,
            loaders: [
                'cache-loader',
                {
                    path: 'ts-loader',
                    query: { happyPackMode: true }
                }
            ]
        }),
        new ForkTsCheckerNotifierWebpackPlugin({alwaysNotify: true}),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.join(__dirname, 'tslint.json'),
            tsconfig: path.join(__dirname, 'tsconfig.json')
        })
    ],
    module: {
        rules: [
            // { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' , options: {
            //     configFile: path.join(__dirname, 'tslint.json')
            // }},
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' },
            { test: /\.ts$/, loader: 'happypack/loader?id=ts', exclude: '/node_modules/'}
            // { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/', options: {
            //     configFile: path.join(__dirname, 'tsconfig.json'),
            //     transpileOnly: true
            // }}
        ]
    },
    devtool: 'source-map'
};
