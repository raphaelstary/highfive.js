"use strict";

var WWW_BUILT = 'www-built',
    WWW = 'www',
    INDEX = 'index.html',
    MANIFEST = 'manifest.json',
    GFX = 'gfx',
    DATA = 'data',
    SFX = 'sfx',
    MIN_JS = 'min.js',
    MIN_CSS = 'min.css';

var UglifyJS = require("uglify-js"),
    UglifyCSS = require('uglifycss'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    minifyJSON = require("node-json-minify"),
    Minimize = require('minimize'),
    minimize = new Minimize();

buildTheProject();

function buildTheProject() {
    loadIndexFile(function (error, data) {
        if (error) {
            return console.log('error reading index file: ' + error);
        }

        mkdir(WWW_BUILT, function () {

            var $ = loadDocumentDOM(data);

            var minifiedJS = minifyJS($);
            writeJsFile(minifiedJS);

            var minifiedCSS = minifyCSS($);
            writeCssFile(minifiedCSS);

            var newIndex = updateSources($);
            minifyHtml(newIndex,
                writeIndexFile);

            cpdir(WWW + '/' + GFX, WWW_BUILT + '/' + GFX);
            cpdir(WWW + '/' + DATA, WWW_BUILT + '/' + DATA);
            cpdir(WWW + '/' + SFX, WWW_BUILT + '/' + SFX);

            minifyJSONFile(WWW, MANIFEST,
                writeFile.bind(null, WWW_BUILT, MANIFEST)
            );
        });
    });
}

function loadDocumentDOM(data) {
    console.log('parsing DOM');
    return cheerio.load(data);
}

function loadIndexFile(callback) {
    console.log('loading index file');
    fs.readFile(WWW + '/' + INDEX, 'utf8', callback);
}

function getExtension(fileName) {
    return fileName.split('.').pop();
}

function cp(srcPath, file, destPath) {
    console.log('copy ' + srcPath + '/' + file + " to " + destPath);
    fs.createReadStream(srcPath + '/' + file).pipe(fs.createWriteStream(destPath + '/' + file));
}
function isJSON(file) {
    return getExtension(file) == 'json';
}

function minifyJSONFile(srcPath, fileName, callback) {
    console.log('start task: minify ' + fileName);

    fs.readFile(srcPath + '/' + fileName, 'utf8', function (error, data) {
        var minified = minifyJSON(data);

        console.log('success task: minify ' + fileName);

        callback(minified);
    });
}

function writeFile(destPath, fileName, data) {
    console.log('start task: write ' + fileName);

    fs.writeFile(destPath + '/' + fileName, data, 'utf8', function (err) {
        if (err) {
            return console.log("error writing file: " + err);
        }
        console.log('success task: write ' + fileName);
    });
}

function cpDirFiles(srcPath, destPath) {
    fs.readdir(srcPath, function (error, files) {
        (files || []).forEach(function (file) {
            if (file == 'raw' || file == 'Thumbs.db')
                return;

            if (isJSON(file)) {
                minifyJSONFile(srcPath, file,
                    writeFile.bind(null, destPath, file)
                );
            } else {
                cp(srcPath, file, destPath);
            }
        });
    });
}
function cpdir(srcPath, destPath) {
    mkdir(destPath, function () {
        cpDirFiles(srcPath, destPath);
    });
}

function mkdir(name, callback) {
    fs.rmdir(name, function () {
        fs.mkdir(name, function () {
            callback();
        });
    });
}

function writeJsFile(data) {
    writeFile(WWW_BUILT, MIN_JS, data);
}

function writeCssFile(data) {
    writeFile(WWW_BUILT, MIN_CSS, data);
}

function minifyHtml(data, callback) {
    console.log("starting task: minify HTML");
    minimize.parse(data, function (error, data) {

        console.log("success task: minify HTML");
        callback(data);
    });
}

function writeIndexFile(data) {
    writeFile(WWW_BUILT, INDEX, data);
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
    console.log("starting task: minify JS");

    var allScripts = getAllJsFileNames($);
    var minified = UglifyJS.minify(allScripts).code;

    console.log('success task: minify JS');
    return  minified;
}

function minifyCSS($) {
    console.log("starting task: minify CSS");

    var allCSS = getAllCssFileNames($);
    var minified = UglifyCSS.processFiles(allCSS, {uglyComments: true});

    console.log('success task: minify CSS');
    return  minified;
}

function updateSources($) {
    console.log("starting task: update html sources");

    $('script').remove();
    $('body').append('<script src="' + MIN_JS + '"></script>');

    $('link').each(function () {
        if ($(this).attr('rel') == 'stylesheet')
            $(this).remove();
    });

    $('head').append('<link rel="stylesheet" href="' + MIN_CSS + '">');

    var html = $.html();

    console.log("success task: update html sources");
    return  html;
}