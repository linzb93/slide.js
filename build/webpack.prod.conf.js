var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConf = require('./webpack.base.conf');

function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
}

module.exports = merge(baseConf, {
    output: {
        path: resolve('dist'),
        filename: 'slide.js'
    },
    module: {
        rules: [{
            test: '/\.js$/',
            loader: 'babel-loader',
            include: [resolve('src')]
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});