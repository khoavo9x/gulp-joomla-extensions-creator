let gulp = require('gulp');
let argv = require('yargs').argv;
let twig = require('gulp-twig');
let fs   = require('fs');
let rename = require('gulp-rename');
let type = "plg";

gulp.task('create:plugin', function (cb) {
  let name  = argv.name;
  let group = argv.group;
  let path  = argv.path;

  if (name === undefined || group === undefined || path === undefined) {
    throw new Error("name, group and path are required.");
  }

  if (path[path.length - 1] === "/") {
    path = path.substr(0, path.length - 1);
  }

  let dest = path + '/' + group + '/' + name;

  if (fs.existsSync(dest)) {
    throw new Error("Folder already exist: " + dest);
  }

  fs.mkdirSync(dest);
  fs.writeFile(dest + "/index.html", "<!DOCTYPE html><title></title>\n");

  fs.mkdirSync(dest + '/language');
  fs.writeFile(dest + '/language' + "/index.html", "<!DOCTYPE html><title></title>\n");

  fs.mkdirSync(dest + '/language/en-GB');
  fs.writeFile(dest + '/language/en-GB' + "/index.html", "<!DOCTYPE html><title></title>\n");

  let languageFileName = 'en-GB.' + type + '_' + group + '_' + name;

  let renderSysLanguage = () => {
    return gulp.src('./templates/plugin.language.ini.twig')
      .pipe(twig({
        data: { type, group, name }
      }))
      .pipe(rename(languageFileName + '.sys.ini'))
      .pipe(gulp.dest(dest + '/language/en-GB/'));
  };

  let renderLanguage = () => {
    return gulp.src('./templates/plugin.language.ini.twig')
      .pipe(twig({
        data: { type, group, name }
      }))
      .pipe(rename(languageFileName + '.ini'))
      .pipe(gulp.dest(dest + '/language/en-GB/'))
      .on('end', renderSysLanguage);
  };

  let renderPhp = () => {
    return gulp.src('./templates/plugin.php.twig')
      .pipe(twig({
        data: { group, name }
      }))
      .pipe(rename(name + '.php'))
      .pipe(gulp.dest(dest))
      .on('end', renderLanguage);
  };

  return gulp.src('./templates/plugin.xml.twig')
    .pipe(twig({
      data: { group, name }
    }))
    .pipe(rename(name + '.xml'))
    .pipe(gulp.dest(dest))
    .on('end', renderPhp);
});
