var gulp = require('gulp'),
	server = require('gulp-express'),
	sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),

	app = require('./app');

var onError = function(err) {
	err = {
		'Name': err.name,
		'File': err.file,
		'Reason': err.reason,
		'Message': err.message
	}
	console.log(err);
	this.emit('end');
};

gulp.task('css', function() {
	return gulp.src('public/stylesheets/!(style)*.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(server.notify());
});

gulp.task('sass', function() {
	return gulp.src('src/sass/*.sass')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(sass({
			style: 'expanded',
			errLogToConsole: true
		}))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe(server.notify());
});

gulp.task('lint', function() {
	return gulp.src('public/javascripts/*.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(server.notify());
});

gulp.task('templates', function() {
	return gulp.src('views/**/*.jade')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(server.notify());
});

gulp.task('server', function () {
	// Start the server at the beginning of the task
	server.run(['./bin/www']);

	gulp.watch('public/stylesheets/!(style)*.css',['css']);
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('public/javascripts/*.js',['lint']);
	gulp.watch('views/**/*.jade', ['templates']);

});

gulp.task('default', ['sass', 'lint', 'server'], function() {

});