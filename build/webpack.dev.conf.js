var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConf = require('./webpack.base.conf');

Object.keys(baseConf.entry).forEach(name => {
    baseConf.entry[name] = ['./build/dev-client'].concat(baseConf.entry[name]);
});

module.exports = merge(baseConf, {
    output: {
        path: '/',
        filename: '[name].js'
    },
    devServer: {
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: false
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});