var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var Q = require('q');

var config = {
    assetsDir: '.',
    sassPattern: 'sass/**/*.scss',
/*
    bowerDir: 'vendor/bower_components',
*/
    revManifestPath: './rev-manifest.json'
};
var app = {};

app.errorHandling = function(error) {
    console.log(error.toString());
    this.emit('end');
};

app.addStyle = function(paths, outputFilename) {
    return gulp.src(paths)
        .pipe(plugins.plumber(function(error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.concat(outputFilename))
        .pipe(plugins.cleanCss())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
};

app.addScript = function(paths, outputFilename) {
    return gulp.src(paths)
        .pipe(plugins.plumber(function(error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(outputFilename))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./js'))
};

app.copy = function(srcFiles, outputDir) {
    return gulp.src(srcFiles)
        .pipe(gulp.dest(outputDir));
};

var Pipeline = function() {
    this.entries = [];
};
Pipeline.prototype.add = function() {
    this.entries.push(arguments);
};

Pipeline.prototype.run = function(callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;

    var runNextEntry = function() {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {
            deferred.resolve();
            return;
        }

        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function() {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();

    return deferred.promise;
};

gulp.task('styles', function() {
    var pipeline = new Pipeline();

/*
    pipeline.add([
        config.bowerDir+'/bootstrap/scss/bootstrap-flex.scss'
    ], 'bootstrap-min.css');

*/
    pipeline.add([
/*
        config.bowerDir+'/fontawesome/css/font-awesome.css',
        config.bowerDir+'/tether/dist/css/tether-theme-arrows.css',
        config.bowerDir+'/jquery-ui/themes/smoothness/jquery-ui.css',
*/
        config.assetsDir+'/sass/base.scss'
    ], 'cwepss.css');

    return pipeline.run(app.addStyle);
});

/*
gulp.task('scripts', function() {
    var pipeline = new Pipeline();

    pipeline.add(
        [
            config.bowerDir+'/jquery/dist/jquery.min.js'
        ],
        'jquery-min.js'
    );

    pipeline.add(
        [
            config.bowerDir+'/jquery-ui/jquery-ui.js',
            config.bowerDir+'/tether/dist/js/tether.js',
            config.bowerDir+'/jquery-ui/ui/i18n/datepicker-fr.js',
            config.bowerDir+'/jquery-ui/ui/i18n/datepicker-nl.js',
            config.bowerDir+'/bootstrap/dist/js/bootstrap.js',
            config.assetsDir+'/js/!**!/!*.js'
        ],
        'site-min.js'
    );

    return pipeline.run(app.addScript);
});

gulp.task('fonts', function() {
    return app.copy(
        config.bowerDir+'/fontawesome/fonts/!*',
        'web/fonts'
    );
});

gulp.task('ui-images', function() {
    return app.copy(
        config.bowerDir+'/jquery-ui/themes/smoothness/images/!*',
        'web/css/images'
    );
});

*/
gulp.task('clean', function() {
    del.sync(config.revManifestPath);
    del.sync('css/*');
/*
    del.sync('web/js/!*');
    del.sync('web/fonts/!*');
*/
});

gulp.task('watch', function() {
    gulp.watch(config.assetsDir+'/'+config.sassPattern, ['styles']);
/*
    gulp.watch(config.bowerDir+'/bootstrap/dist/css/bootstrap.css', ['styles']);
    gulp.watch(config.bowerDir+'/bootstrap/scss/bootstrap-flex.scss', ['styles']);
    gulp.watch(config.bowerDir+'/fontawesome/css/font-awesome.css', ['styles']);
    gulp.watch(config.bowerDir+'/tether/dist/css/tether-theme-arrows.css', ['styles']);
    gulp.watch(config.assetsDir+'/js/!**!/!*.js', ['scripts']);
    gulp.watch(config.bowerDir+'/bootstrap/dist/js/!**!/!*.js', ['scripts']);
    gulp.watch(config.bowerDir+'/tether/dist/js/!**!/!*.js', ['scripts']);
*/
});

gulp.task('default', ['styles'/*, 'scripts', 'fonts'*/]);
