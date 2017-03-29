'use strict';

/**
 * DEFAULTS
 */
var MAIN_JS = 'main';
var INDEX_HTML = 'index';

var MAIN_OUT_JS = 'index';
var INDEX_OUT_HTML = 'index';
var APP_OUT_CSS = 'app';

var BASE_PATH = '../www';
var SRC_PATH = 'js';
var BASE_OUT_PATH = '../../target';

var AUDIO_PATH = 'audio';
var DATA_PATH = 'data';
var GFX_PATH = 'gfx';

// var TARGETS = ['atv', 'web', 'mac', 'win10', 'win', 'ios', 'android', 'xbo', 'winphone', 'firetv', 'fire'];
var TARGETS = ['atv', 'win'];

/**
 * imports
 */
var UglifyJS = require('uglify-js');
var UglifyCSS = require('uglifycss');
var cheerio = require('cheerio');
var fs = require('fs');
var fsExtra = require('fs-extra');
var minifyJSON = require('node-json-minify');
var Minimize = require('minimize');
var minimize = new Minimize();

var args = process.argv.slice(2);
var targets;
var flagIndex = args.indexOf('--target');
if (flagIndex !== -1) {
    targets = args[flagIndex + 1].split(',');
} else {
    targets = TARGETS.slice();
}

// general version
build();
// specific targets
targets.forEach(build);

function build(target) {
    loadIndexFile(function (data) {
        rmTargetDir(target, mkTargetDir.bind(undefined, target, function () {

            var $ = loadDocumentDOM(data);

            var minifiedJS = minifyJS(target, $);
            writeJSFile(target, minifiedJS);

            var minifiedCSS = minifyCSS($);
            writeCSSFile(target, minifiedCSS);

            var newHTMLFile = updateSources($);
            minifyHtml(newHTMLFile, writeHTMLFile.bind(undefined, target));

            cpBaseSubDir(target, GFX_PATH);
            cpBaseSubDir(target, DATA_PATH);
            cpBaseSubDir(target, AUDIO_PATH);
        }));
    });
}

function loadIndexFile(callback) {
    console.log('loading index file');
    fs.readFile(BASE_PATH + '/' + INDEX_HTML + '.html', 'utf8', function (err, data) {
        if (err) {
            return console.log('error loading index file: ' + err);
        }
        callback(data);
    });
}

function rmTargetDir(target, callback) {
    if (target) {
        console.log('rm -rf target-' + target);
        fsExtra.remove(BASE_OUT_PATH + '-' + target, function (err) {
            if (err) {
                return console.log('error removing target folder: ' + err);
            }

            callback();
        });

    } else {
        console.log('rm -rf target');
        fsExtra.remove(BASE_OUT_PATH, function (err) {
            if (err) {
                return console.log('error removing target folder: ' + err);
            }

            callback();
        });
    }
}

function mkTargetDir(target, callback) {
    if (target) {
        fs.mkdir(BASE_OUT_PATH + '-' + target, function (err) {
            if (err) {
                return console.log('error creating target folder: ' + err);
            }

            callback();
        });
    } else {
        fs.mkdir(BASE_OUT_PATH, function (err) {
            if (err) {
                return console.log('error creating target folder: ' + err);
            }

            callback();
        });
    }
}

function loadDocumentDOM(data) {
    console.log('parsing DOM');
    return cheerio.load(data);
}

function minifyJS(target, $) {
    console.log('task started: minify JS');

    var allScripts = getAllJsFileNames($);

    allScripts.pop();
    allScripts.push(getTargetMain(target));

    var minified = UglifyJS.minify(allScripts).code;

    console.log('task successful: minify JS');
    return minified;
}

function getAllJsFileNames($) {
    var allScripts = [];
    $('script').each(function () {
        allScripts.push(BASE_PATH + '/' + $(this).attr('src'));
    });
    return allScripts;
}

function getTargetMain(target) {
    if (target) {
        return BASE_PATH + '/' + SRC_PATH + '/' + MAIN_JS + '-' + target + '.js';
    }
    return BASE_PATH + '/' + SRC_PATH + '/' + MAIN_JS + '.js';
}

function writeFile(destPath, fileName, data) {
    console.log('task started: write ' + fileName);

    fs.writeFile(destPath + '/' + fileName, data, 'utf8', function (err) {
        if (err) {
            return console.log('error writing file: ' + err);
        }
        console.log('task successful: write ' + fileName);
    });
}

function minifyCSS($) {
    console.log('task started: minify CSS');

    var allCSS = getAllCssFileNames($);
    var minified = UglifyCSS.processFiles(allCSS, {uglyComments: true});

    console.log('task successful: minify CSS');
    return minified;
}

function getAllCssFileNames($) {
    var allCSS = [];
    $('link').each(function () {
        if ($(this).attr('rel') == 'stylesheet') {
            allCSS.push(BASE_PATH + '/' + $(this).attr('href'));
        }
    });
    return allCSS;
}

function writeJSFile(target, data) {
    if (target) {
        writeFile(BASE_OUT_PATH + '-' + target, MAIN_OUT_JS + '.js', data);
    } else {
        writeFile(BASE_OUT_PATH, MAIN_OUT_JS + '.js', data);
    }
}

function writeCSSFile(target, data) {
    if (target) {
        writeFile(BASE_OUT_PATH + '-' + target, APP_OUT_CSS + '.css', data);
    } else {
        writeFile(BASE_OUT_PATH, APP_OUT_CSS + '.css', data);
    }
}

function updateSources($) {
    console.log('task started: update html sources');

    $('script').remove();
    $('body').append('<script src="' + MAIN_OUT_JS + '.js' + '"></script>');

    $('link').each(function () {
        if ($(this).attr('rel') == 'stylesheet') {
            $(this).remove();
        }
    });

    $('head').append('<link rel="stylesheet" href="' + APP_OUT_CSS + '.css' + '">');

    var html = $.html();

    console.log('task successful: update html sources');
    return html;
}

function minifyHtml(data, callback) {
    console.log('task started: minify HTML');
    minimize.parse(data, function (err, data) {
        if (err) {
            return console.log('error minifying HTML: ' + err);
        }
        console.log('task successful: minify HTML');
        callback(data);
    });
}

function writeHTMLFile(target, data) {
    if (target) {
        writeFile(BASE_OUT_PATH + '-' + target, INDEX_OUT_HTML + '.html', data);
    } else {
        writeFile(BASE_OUT_PATH, INDEX_OUT_HTML + '.html', data);
    }
}

function cpBaseSubDir(target, subDirPath) {
    if (target) {
        fs.mkdir(BASE_OUT_PATH + '-' + target + '/' + subDirPath, function (err) {
            if (err) {
                return console.log('error creating folder: ' + err);
            }

            cpFilteredDirFiles(target, BASE_PATH + '/' + subDirPath, BASE_OUT_PATH + '-' + target + '/' + subDirPath);
        });
    } else {
        fs.mkdir(BASE_OUT_PATH + '/' + subDirPath, function (err) {
            if (err) {
                return console.log('error creating folder: ' + err);
            }

            cpFilteredDirFiles(undefined, BASE_PATH + '/' + subDirPath, BASE_OUT_PATH + '/' + subDirPath);
        });
    }
}

function cpFilteredDirFiles(target, srcPath, destPath) {
    fs.readdir(srcPath, function (err, files) {
        if (err) {
            return console.log('error reading dir: ' + err);
        }

        var filteredFiles;

        if (!target) {
            filteredFiles = (files || []).filter(function (file) {
                return !includes(file, '-');
            });
        } else {

            var specificFiles = [];
            var basicFiles = [];

            filterFiles(target, files || [], specificFiles, basicFiles);

            specificFiles.forEach(function (file) {
                var infix = '-' + target;
                var prefix = file.substring(0, file.indexOf(infix));

                var extension = getExtension(file);

                basicFiles = basicFiles.filter(function (basic) {
                    return !(startsWith(basic, prefix) && getExtension(basic) == extension);
                });
            });

            filteredFiles = specificFiles.concat(basicFiles);
        }

        filteredFiles.forEach(function (file) {
            if (file == 'raw' || file == 'Thumbs.db') {
                return;
            }

            if (isJSON(file)) {
                minifyJSONFile(srcPath, file, writeFile.bind(undefined, destPath, file));
            } else {
                cp(srcPath, file, destPath);
            }
        });
    });
}

function filterFiles(target, files, specificFiles, basicFiles) {
    if (files.length < 1) {
        return;
    }

    var file = files.pop();

    if (includes(file, '-' + target)) {
        // CASE 1: exactly what we're looking for, specific target file for given target
        specificFiles.push(file);

    } else if (includes(file, '-')) {
        // CASE 2: specific target file for other target
        // discard file

    } else {
        // CASE 3: basic file without specific target
        basicFiles.push(file);
    }

    filterFiles(target, files, specificFiles, basicFiles);
}

function includes(actualString, searchString) {
    return actualString.indexOf(searchString) !== -1;
}

function startsWith(actualString, searchString) {
    return actualString.indexOf(searchString, 0) === 0;
}

function isJSON(file) {
    return getExtension(file) == 'json';
}

function getExtension(fileName) {
    return fileName.split('.').pop();
}

function minifyJSONFile(srcPath, fileName, callback) {
    console.log('task started: minify ' + fileName);

    fs.readFile(srcPath + '/' + fileName, 'utf8', function (error, data) {
        var minified = minifyJSON(data);

        console.log('task successful: minify ' + fileName);

        callback(minified);
    });
}

function cp(srcPath, file, destPath) {
    console.log('copy ' + srcPath + '/' + file + ' to ' + destPath);
    fs.createReadStream(srcPath + '/' + file).pipe(fs.createWriteStream(destPath + '/' + file));
}