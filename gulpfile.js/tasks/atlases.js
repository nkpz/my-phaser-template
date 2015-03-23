'use strict';


module.exports = function (gulp, $, config) {

  var fs    = require('fs');
  var path  = require('path');
  var merge = require('merge-stream');

  var dirs = config.dirs;

  function pot (n) {
    var m = 2;
    while (m < n) m *= 2;
    return m;
  }

  // Modified version of this recipe:
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md

  function getFolders (dir) {
    return fs.readdirSync(dir)
      .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
  }

  gulp.task('atlas', function () {
    var folders = getFolders(dirs['raw-assets']);

    var tasks = folders.map(function (name) {
      var folder = path.join(dirs['raw-assets'], name, '*.png');
      var spriteData = gulp.src(folder, { read: false })
        .pipe($.spritesmith({
          cssTemplate : 'src/atlas.template',
          cssName     : name + '.js',
          imgName     : name + '.png',
          padding     : 8
        }));

      spriteData.img
        .pipe($.gm(function (gmFile, done) {
          gmFile.size(function (err, size) {
            var w = pot(size.width);
            var h = pot(size.height);

            done(null, gmFile
              .set('colorspace', 'RGB')
              .background('none')
              .gravity('northwest')
              .extent(w, h));
          });
        }, { imageMagick: true }))
        .pipe(gulp.dest(dirs['assets']));

      spriteData.css.pipe(gulp.dest(dirs['atlases']));

      return spriteData;
    });

    return merge(tasks);
  });

};
