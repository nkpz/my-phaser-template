'use strict';


module.exports = function (gulp, $, config, deps) {

  var browserSync    = deps['browserSync'];
  var autoprefixer   = deps['autoprefixer'];
  var handleErrors   = deps['handleErrors'];
  var mainBowerFiles = deps['mainBowerFiles'];

  var meta    = config.meta;
  var dirs    = config.dirs;
  var globs   = config.globs;
  var options = config.pluginOptions;

  // Forget any cached data
  // Reference: https://github.com/gulpjs/gulp/blob/master/docs/recipes/incremental-builds-with-concatenate.md
  function forget (cacheName) {
    return function (e) {
      if (e.type === 'deleted') {
        $.remember.forget(cacheName, e.path);
        delete $.cached.caches[cacheName][e.path];
      }
    };
  }

  // Compile template views into HTML files.
  gulp.task('dev:build:views', function () {
    return gulp.src(globs['views'])
      .pipe($.compileHandlebars(meta, {
        batch: dirs['partials']
      }))
      .pipe($.rename({ extname: '.html' }))
      .pipe(gulp.dest(dirs['build']))
      .pipe(browserSync.reload({ stream: true }));
  });

  // Compile style sheet templates, prefix proposed and non-standard rules.
  gulp.task('dev:build:styles', function () {
    return gulp.src(globs['styles'])
      .pipe(handleErrors())
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.postcss([
        autoprefixer()
      ]))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dirs['build']))
      .pipe(browserSync.reload({ stream: true }));
  });

  // Compile script files as AMD, bundle them as a single file.
  gulp.task('dev:build:scripts', [ 'dev:lint' ], function () {
    return gulp.src(globs['scripts'])
      .pipe(handleErrors())
      .pipe($.cached('scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel(options['dev:build:scripts']))
      .pipe($.remember('scripts'))
      .pipe($.concat('game.js'))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dirs['build']))
      .pipe(browserSync.reload({ stream: true }));
  });

  // Concatenates Bower script libraries in a single file.
  gulp.task('dev:build:bundle', function () {
    var libs = [ 'node_modules/babel-core/browser-polyfill.js' ]
      .concat(mainBowerFiles());

    return gulp.src(libs)
      .pipe($.filter('**/*.js'))
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.concat('bundle.js'))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dirs['build']))
      .pipe(browserSync.reload({ stream: true }));
  });

  // Instantiate a live web development server for cross-browser, cross-device
  // testing.
  gulp.task('dev:server', [ 'dev:build' ], function () {
    browserSync({
      server: {
        baseDir: [
          dirs['static'],
          dirs['build']
        ]
      },
      ghostMode: false,
      notify: false
    });
  });

  // Monitors files for changes, trigger rebuilds as needed.
  gulp.task('dev:watch', function () {
    gulp.watch(globs['scripts'], [ 'dev:build:scripts' ])
      .on('change', forget('scripts'));

    gulp.watch(globs['styles'], [ 'dev:build:styles' ]);
    gulp.watch(globs['views'],  [  'dev:build:views' ]);
    gulp.watch('bower.json',    [ 'dev:build:bundle' ]);
  });

  // Pass through modified script files and issue warnings about
  // non-conformances.
  gulp.task('dev:lint', function () {
    return gulp.src([ globs['scripts'] ])
      .pipe(handleErrors())
      .pipe($.cached('jshint'))
      .pipe($.jshint('.jshintrc'))
      .pipe($.jshint.reporter('jshint-stylish'));
  });

  // The overall build task.
  gulp.task('dev:build', [
    'dev:build:views',
    'dev:build:bundle',
    'dev:build:styles',
    'dev:build:scripts'
  ]);

  // The main development task.
  gulp.task('dev', [
    'dev:server',
    'dev:watch'
  ]);

  // Aliasing `dev` as default task.
  gulp.task('default', [ 'dev' ]);

};
