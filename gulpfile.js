const fs          = require('fs');
const path        = require('path');


const browserSync = require('browser-sync');
const gulp        = require('gulp');
const insert      = require('gulp-insert');
const md          = require('gulp-remarkable');
const name        = require('gulp-rename');


const srcpath = 'src';
const outpath = 'build';

const postPrepend = fs.readFileSync(path.join(__dirname, srcpath, 'postprepend.html'), 'utf8');
const postAppend  = fs.readFileSync(path.join(__dirname, srcpath, 'postappend.html'), 'utf8');


// Tasks
gulp.task('copyPostCss', () => gulp
  .src(`./${srcpath}/post/*.css`)
  .pipe(gulp.dest(`${path.join(__dirname, outpath)}/post/`)));

gulp.task('buildPost', ['copyPostCss'], () => gulp
  .src('./src/post/*.md')
  .pipe(md({
    remarkableOptions: {
      typographer: true,
      linkify:     true,
      html:        true,
    },
  }))
  .pipe(insert.wrap(postPrepend, postAppend))
  .pipe(name((filepath) => {
    filepath.dirname += '/post';
    // filepath.basename += '-goodbye';
    filepath.extname = '.html';
  }))
  .pipe(gulp.dest(path.join(__dirname, outpath))));

gulp.task('md_watch', ['buildPost'], browserSync.reload);

// Watch
gulp.task('watch', () => {
  browserSync({
    server: {
      baseDir: path.join(__dirname, outpath),
    },
  });
  gulp.watch(`./${srcpath}/**/*.md`, ['md_watch']);
});

// Default Task
gulp.task('default');
