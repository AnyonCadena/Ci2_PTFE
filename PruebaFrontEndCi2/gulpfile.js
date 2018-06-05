/*
* Dependencias
*/
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

/*
* Configuración de la tarea 'tarea'
*/
gulp.task('tarea', function () {
    gulp.src('wwwroot/js/source/*.js')
        .pipe(concat('todo.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/js/build/'))
});