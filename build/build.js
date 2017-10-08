var fs = require('fs');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, con) => {
            if (err) {
                reject(err);
            } else {
                resolve(con);
            }
        });
    })
}

webpack(webpackConfig, err => {
    if (err) {
        throw err;
    }
    Promise.all([readFile('./dist/slide.js'), readFile('./build/copyright')])
    .then(([code, cr]) => {
        var con = cr + '\n' + code;
        fs.writeFile('./dist/slide.js', con, 'utf8', err => {
            if (err) {
                throw err;
            }
            console.log('build success');
        });
    });
});