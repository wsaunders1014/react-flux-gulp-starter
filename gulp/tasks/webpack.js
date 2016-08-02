'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const gulpConfig = require('../config.js');

import {
    clientConfig,
    clientDevConfig,
    serverConfig
} from '../../webpack.config.js';

import {
    isFunction
} from 'lodash';

gulp.task('webpack:build', function(callback) {

    const definePlugin = new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        'process.env': {
            // This has effect on the react lib size
            'NODE_ENV': JSON.stringify('production')
        }
    });

    serverConfig.plugins = serverConfig.plugins.concat(definePlugin)
    clientConfig.plugins = clientConfig.plugins.concat(definePlugin);

    webpack([clientConfig, serverConfig], (err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString(clientDevConfig.stats));
        callback();
    });
});

const devCompiler = webpack(clientDevConfig);

gulp.task('webpack:build-dev', callback => {

    devCompiler.run((err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString(clientDevConfig.stats));
        callback();
    });
});

const serverCompiler = webpack(serverConfig);

export const buildWebServer = (callback) => {
    serverCompiler.run((err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build-sever', err);
        gutil.log('[webpack:build-server]', stats.toString(serverConfig.stats));

        return isFunction(callback) && callback();
    });
};

gulp.task('webpack:build-server', buildWebServer);

export const watchWebServer = (callback) => {

    let started = false;
    serverCompiler.watch({
        aggregateTimeout: 300,
    }, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack:watch-sever', err);
        gutil.log('[webpack:watch-server]', stats.toString(serverConfig.stats));

        if (!started) {
            started = true;
            return isFunction(callback) && callback();
        }
    });
};

gulp.task('webpack:watch-server', watchWebServer);

gulp.task('webpack:dev-server', callback => {
    let firstBundle = true;
    let bundleStart;

    devCompiler.plugin('compile', function() {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    devCompiler.plugin('done', function() {
        if (firstBundle) {
            callback();
            firstBundle = false;
        }
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });
    new WebpackDevServer(devCompiler, gulpConfig.webpackDevServer).listen(8080);
});
