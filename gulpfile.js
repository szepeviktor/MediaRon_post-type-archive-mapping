const gulp = require( 'gulp' );
const del = require( 'del' );
const run = require( 'gulp-run' );
const zip = require( 'gulp-zip' );

gulp.task( 'bundle', function() {
	return gulp.src( [
		'**/*',
		'!bin/**/*',
		'!node_modules/**/*',
		'!vendor/**/*',
		'!composer.*',
		'!release/**/*',
		'!src/**/*',
		'!src',
		'!tests/**/*',
		'!phpcs.xml'
	] )
		.pipe( gulp.dest( 'release/post-type-archive-mapping' ) );
} );

gulp.task( 'remove:bundle', function() {
	return del( [
		'release/post-type-archive-mapping',
		'post-type-archive-mapping.zip',
	] );
} );

gulp.task( 'wporg:prepare', function() {
	return run( 'mkdir -p release' ).exec();
} );

gulp.task( 'release:copy-for-zip', function() {
	return gulp.src('release/post-type-archive-mapping/**')
		.pipe(gulp.dest('post-type-archive-mapping'));
} );

gulp.task( 'release:zip', function() {
	return gulp.src('post-type-archive-mapping/**/*', { base: "." })
	.pipe(zip('post-type-archive-mapping.zip'))
	.pipe(gulp.dest('.'));
} );

gulp.task( 'cleanup', function() {
	return del( [
		'release',
		'post-type-archive-mapping'
	] );
} );

gulp.task( 'clean:bundle', function() {
	return del( [
		'release/post-type-archive-mapping/bin',
		'release/post-type-archive-mapping/node_modules',
		'release/post-type-archive-mapping/vendor',
		'release/post-type-archive-mapping/tests',
		'release/post-type-archive-mapping/trunk',
		'release/post-type-archive-mapping/gulpfile.js',
		'release/post-type-archive-mapping/Makefile',
		'release/post-type-archive-mapping/package*.json',
		'release/post-type-archive-mapping/phpunit.xml.dist',
		'release/post-type-archive-mapping/README.md',
		'release/post-type-archive-mapping/CHANGELOG.md',
		'release/post-type-archive-mapping/webpack.config.js',
		'release/post-type-archive-mapping/.editorconfig',
		'release/post-type-archive-mapping/.eslistignore',
		'release/post-type-archive-mapping/.eslistrcjson',
		'release/post-type-archive-mapping/.git',
		'release/post-type-archive-mapping/.gitignore',
		'release/post-type-archive-mapping/src/block',
		'package/prepare',
	] );
} );

gulp.task( 'default', gulp.series(
	'remove:bundle',
	'bundle',
	'wporg:prepare',
	'clean:bundle',
	'release:copy-for-zip',
	'release:zip',
	'cleanup'
) );
