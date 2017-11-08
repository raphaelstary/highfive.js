'use strict';

const fs = require('fs');

const scriptTags = fs.readFileSync('example/helloworld/index.html', 'utf8')
    .split('\n')
    .filter(line => line.trim().startsWith('<script'))
    .map(tag => tag.match(/src="(.+?)"/)[1])
    .filter(src => src.startsWith('../../src/'))
    .map(src => src.replace('../../', 'node_modules/highfive.js/'))
    .map(src => '<script src="' + src + '"></script>')
    .join('\n');

const template = fs.readFileSync('tool/template.html', 'utf8').replace('{scripts}', scriptTags);
fs.writeFileSync('dist/index.html', template, 'utf8');