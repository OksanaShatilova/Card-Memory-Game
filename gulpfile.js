"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var run = require("run-sequence");
var del = require("del");
var csscomb = require('gulp-csscomb');

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csscomb())
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});


gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "build/",
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"]);
});

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "html",
    done
  );
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});


gulp.task("clean", function() {
  return del("build");
});