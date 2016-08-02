var changed = require('gulp-changed'),
    gulp = require('gulp-help')(require('gulp')),
    config = require('../config').nodemon,
    nodemon = require('gulp-nodemon');

var http = require('http');
var httpProxy = require('http-proxy');

gulp.task('server', 'Starts local development server and watches', ['webpack:dev-server', 'nodemon'], function(cb) {
    var proxy = httpProxy.createProxyServer();

    proxy.on('error', (e) => {
        console.log(`There was an error while connecting to the webpack dev server proxy. ${e}`);
    });

    http.createServer(function (req, res) {

        if(req.url.indexOf('/assets') === 0) {
            var _break = false;
            ['modernizr'].forEach(exclude => {
                if(req.url.includes(exclude)) _break = true;
            });

            if(!_break) {
                return proxy.web(req, res, {
                    target: 'http://0.0.0.0:8080'
                });
            }
        }

        proxy.web(req, res, {
            target: 'http://0.0.0.0:' + process.env.PORT,
        });
    }).listen(parseInt(process.env.PROXY_PORT, 10), cb);
});
