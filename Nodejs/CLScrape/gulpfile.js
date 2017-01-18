var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jsFiles =['*.js'];

gulp.task('serve', function(){
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 3001
        },
        watch: jsFiles
    };
    return nodemon(options)
    .on('restart', function(){
        console.log('Restarting...');
    });
});