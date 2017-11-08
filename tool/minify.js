'use strict';

const fs = require('fs');
const UglifyJS = require('uglify-js');

const concatenated = fs.readFileSync('dist/index.html', 'utf8')
    .split('\n')
    .filter(line => line.trim().startsWith('<script'))
    .map(tag => tag.match(/src="(.+?)"/)[1])
    .map(script => fs.readFileSync(script.substring('node_modules/highfive.js/'.length), 'utf8'))
    .join('\n');

fs.writeFileSync('dist/highfive.js', concatenated, 'utf8');

const minified = UglifyJS.minify(concatenated, {fromString: true}).code;
fs.writeFileSync('dist/h5-min.js', minified, 'utf8');