const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const	cheerio = require("gulp-cheerio");
const	replace = require("gulp-replace");
const sync = require("browser-sync").create();
const cleanCSS = require('gulp-clean-css');

// Styles

const styles = () => {
  return gulp.src("source/sass/*.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('source/build/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

//Minify

gulp.task('minify-css', () => {
  return gulp.src('source/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('source/build/css'));
});

exports.cleanCSS = cleanCSS;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

// SVG sprite

const svgSpriteBuild = () => {
  return gulp.src('source/img/svg-sprite/*.svg')

  // minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				// $('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:"source/sass/_sprite.scss",
							template: "source/sass/helpers/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest("source/img/svg-sprite/"));
}

exports.svgSpriteBuild = svgSpriteBuild;

exports.default = gulp.series(
  styles, server, svgSpriteBuild, watcher
);
