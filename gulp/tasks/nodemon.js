var changed = require('gulp-changed'),
    gulp = require('gulp-help')(require('gulp')),
    config = require('../config').nodemon,
    nodemon = require('gulp-nodemon');

gulp.task('nodemon', 'Starts local development server and watches', ['webpack:watch-server'], function(cb) {
    var started = false;

    return nodemon(config)
        .on('start', function() {
            if (!started) {
                started = true;
                setTimeout(function() {
                    cb();
                }, 250);
            }
        });
});
