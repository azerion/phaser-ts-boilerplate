const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const basePath = path.join(__dirname, '../');

module.exports = {
    entry: path.join(basePath, 'ts/app.ts'),
    output: {
        path: path.join(basePath),
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
        })
    ],
    devServer: {
        contentBase: path.join(basePath),
        compress: true,
        port: 9000,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' , options: {
                configFile: path.join(__dirname, 'tslint.json')
            }},
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' },
            { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/', options: {
                configFile: path.join(__dirname, 'tsconfig.json')
            }}
        ]
    },
    devtool: 'source-map'
};
