'use strict';

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require(
    'fork-ts-checker-notifier-webpack-plugin');
const HappyPack = require('happypack');
const basePath = path.join(__dirname, '../');
const config = require('../package.json');

let webpackConfig = require('./webpack.base.config.js');

function createURL(name, version){
    return 'https://cdn.jsdelivr.net/npm/@orange-games/' +
        name +
        '@' +
        version +
        '/build/' +
        name +
        '.min.js'
}

function getPkgInfo(){
    console.log('running get pkg info');

    var pkgObj = config.dependencies;
    var ogMarker = '@orange-games/';
    var newPkgList = [];
    for(var key in pkgObj){
        if(pkgObj.hasOwnProperty(key)){
            if(key.indexOf(ogMarker) !== -1){
                var index = key.indexOf(ogMarker) + ogMarker.length;
                var newKey = key.slice(index, key.length);
                var newValue = null;
                if (pkgObj[key].indexOf('git') !== -1){
                    newValue = pkgObj[key].slice(-5, -2);
                } else {
                    newValue = pkgObj[key].slice(1, 4);
                }
                newPkgList.push(createURL(newKey, newValue));
            }
        }
    }
    return newPkgList;
}

module.exports = function(env) {
    let version = Date.now();
    if (env !== undefined && env.version) {
        version = env.version;
    }

    let myDevConfig = webpackConfig;
    myDevConfig.devtool = 'inline-source-map';
    myDevConfig.output = {
        path: path.join(basePath, '_build/dist'),
        filename: config.name + '.min.js',
    };
    myDevConfig.plugins = myDevConfig.plugins.concat([
        new webpack.DefinePlugin({
            'DEBUG': false,
            'version': JSON.stringify(version),
            'libs': JSON.stringify(getPkgInfo())
        }),
        new CleanWebpackPlugin([path.join(basePath, '_build/dist')], {
            root: basePath
        }),
        new CopyWebpackPlugin([{
            from: path.join(basePath, 'assets'),
            to: path.join(basePath, '_build/dist/assets'),
        }]),
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true,
            },
            mangle: true,
        }),
    ]);

    return myDevConfig;
};