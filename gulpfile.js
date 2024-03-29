var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var tasks   = require('require-dir')('./lib/tasks');
var config  = require('./project-config.json');

var taskDeps = {
  'del'            : require('del'),
  'browserSync'    : require('browser-sync'),
  'runSequence'    : require('run-sequence'),
  'autoprefixer'   : require('autoprefixer-core'),
  'handleErrors'   : require('./lib/utils/handleErrors'),
  'mainBowerFiles' : require('main-bower-files')
};

Object.keys(tasks)
  .map(function (key) { return tasks[key] })
  .filter(function (obj) { return typeof obj === 'function' })
  .forEach(function (task) { task(gulp, plugins, config, taskDeps) });
