'use strict';


module.exports = function (gulp, $, config) {

  var fs   = require('fs');
  var path = require('path');

  var dirs = config.dirs;

  function pot (n) {
    var m = 2;
    while (m < n) { m *= 2 }
    return m;
  }

  function getFolders (dir) {
    return fs.readdirSync(dir)
      .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
  }

  function generateAtlas (name) {
    return $.spritesmith({
      cssTemplate : 'src/atlas.template',
      cssName     : name + '.js',
      imgName     : name + '.png',
      padding     : 8
    });
  }

  function resizeImage () {
    return $.gm(function (gmFile, done) {
      gmFile.size(function (err, size) {
        var w = pot(size.width);
        var h = pot(size.height);

        done(null, gmFile
          .set('colorspace', 'RGB')
          .background('none')
          .gravity('northwest')
          .extent(w, h));
      });
    }, { imageMagick: true });
  }

  function createAtlasTask (name) {
    return function () {
      var folder = path.join(dirs['raw-assets'], name, '*.png');
      var spriteData = gulp.src(folder, { read: false })
        .pipe(generateAtlas(name));

      // Resize generated texture dimensions to a power of 2.
      spriteData.img
        .pipe(resizeImage())
        .pipe(gulp.dest(dirs['assets']));

      // Place the generated module in the source base.
      spriteData.css.pipe(gulp.dest(dirs['atlases']));

      return spriteData;
    };
  }

  getFolders(dirs['raw-assets'])
    .forEach(function (folder) {
      var taskName = 'atlas:' + folder;
      gulp.task(taskName, createAtlasTask(folder));
      return taskName;
    });

};
