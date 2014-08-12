"use strict";

var WWW_BUILT = 'www-built',
    WWW = 'www',
    INDEX = 'index.html',
    GFX = 'gfx',
    DATA = 'data',
    MIN_JS = 'min.js',
    MIN_CSS = 'min.css';

var UglifyJS = require("uglify-js"),
    UglifyCSS = require('uglifycss'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    minifyJSON = require("node-json-minify"),
    Minimize = require('minimize'),
    minimize = new Minimize();

fs.readFile(WWW + '/' + INDEX, 'utf8', function (error, data) {
    if (error) {
        return console.log('error reading index file: ' + error);
    }

    var $ = cheerio.load(data);

    var minifiedJS = minifyJS($);
    var minifiedCSS = minifyCSS($);
    var newIndex = updateSources($);

    mkdir(WWW_BUILT, function () {

        writeJsFile(minifiedJS);
        writeCssFile(minifiedCSS);
        writeIndexFile(newIndex);
        cpdir(WWW + '/' + GFX, WWW_BUILT + '/' + GFX);
        cpdir(WWW + '/' + DATA, WWW_BUILT + '/' + DATA);

    });
});

function getExtension(fileName) {
    return fileName.split('.').pop();
}

function cpdir(srcPath, destPath) {
    mkdir(destPath, function () {
        fs.readdir(srcPath, function (error, files) {
            files.forEach(function (file) {
                if (getExtension(file) == 'json') {
                    fs.readFile(srcPath + '/' + file, 'utf8', function (error, data) {
                        var minified = minifyJSON(data);
                        fs.writeFile(destPath + '/' + file, minified, 'utf8', function (err) {
                            if (err) {
                                return console.log("error writing minified json: " + err);
                            }
                        })
                    });
                } else {
                    fs.createReadStream(srcPath + '/' + file).pipe(fs.createWriteStream(destPath + '/' + file));
                }
            });
        });
    });
}

function mkdir(name, callback) {
    fs.rmdir(name, function (error) {
        fs.mkdir(name, function (error) {
            callback();
        });
    });
}

function writeJsFile(result) {
    fs.writeFile(WWW_BUILT + '/' + MIN_JS, result, 'utf8', function (err, data) {
        if (err) {
            return console.log("error writing js-min: " + err);
        }
    });
}

function writeCssFile(uglified) {
    fs.writeFile(WWW_BUILT + '/' + MIN_CSS, uglified, 'utf8', function (err, data) {
        if (err) {
            return console.log("error writing css-min: " + err);
        }
    });
}

function writeIndexFile(result) {
    minimize.parse(result, function (error, data) {
        fs.writeFile(WWW_BUILT + '/' + INDEX, data, 'utf8', function (err, data) {
            if (err) {
                return console.log("error writing index: " + err);
            }
        });
    });
}

function getAllJsFileNames($) {
    var allScripts = [];
    $('script').each(function () {
        allScripts.push(WWW + '/' + $(this).attr('src'));
    });
    return allScripts;
}

function getAllCssFileNames($) {
    var allCSS = [];
    $('link').each(function () {
        if ($(this).attr('rel') == 'stylesheet')
            allCSS.push(WWW + '/' + $(this).attr('href'));
    });
    return allCSS;
}

function minifyJS($) {
    var allScripts = getAllJsFileNames($);
    return UglifyJS.minify(allScripts).code;
}

function minifyCSS($) {
    var allCSS = getAllCssFileNames($);
    return UglifyCSS.processFiles(allCSS, {uglyComments: true});
}

function updateSources($) {
    $('script').remove();
    $('body').append('<script src="' + MIN_JS +'"></script>');

    $('link').each(function () {
        if ($(this).attr('rel') == 'stylesheet')
            $(this).remove();
    });

    $('head').append('<link rel="stylesheet" href="' + MIN_CSS +'">');

    return $.html();
}