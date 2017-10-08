var express = require('express');
var webpack = require('webpack');
var path = require('path');
var opn = require('opn');
var webpackConfig = require('./webpack.dev.conf');

var app = express();
var compiler = webpack(webpackConfig);
var devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: '/',
    quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});

compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

app.use(devMiddleware);
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join('/', 'static')
app.use(staticPath, express.static('./static'))

devMiddleware.waitUntilValid(() => {
    opn('http://localhost:3000')
});

app.listen(3000, () => {
    console.log("Listening on port 3000!");
});