'use strict';

var fs = require('fs');

var concatenated = fs.readFileSync('dist/index.html', 'utf8')
    .split('\n')
    .filter(function (line) {
        return line.trim().startsWith('<script');
    })
    .map(function (tag) {
        return tag.match(/src="(.+?)"/)[1];
    })
    .map(function (script) {
        var distPathPrefix = 'node_modules/highfive.js/';
        return fs.readFileSync(script.substring(distPathPrefix.length), 'utf8');
    })
    .join('\n');

fs.writeFileSync('dist/highfive.js', concatenated, 'utf8');