'use strict';


module.exports = function (gulp, $, config) {

  var fs    = require('fs');
  var path  = require('path');
  var merge = require('merge-stream');

  var dirs = config.dirs;

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

    var tasks = folders.map(function (folder) {
      var spriteData = gulp.src(path.join(dirs['raw-assets'], folder, '*.png'))
        .pipe($.spritesmith({
          cssTemplate : 'src/atlas.template',
          cssName     : folder + '.js',
          imgName     : folder + '.png',
          padding     : 8
        }));

      spriteData.img.pipe(gulp.dest(dirs['assets']));
      spriteData.css.pipe(gulp.dest(dirs['atlases']));

      return spriteData;
    });

    return merge(tasks);
  });

};
