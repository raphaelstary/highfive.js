var fs = require('fs');

var template =
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head lang="en">\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>highfive.js</title>\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">' +
    '</head>\n' +
    '<body>\n' +
        '{scripts}' +
    '\n' +
    '</body>\n' +
    '</html>\n';

var scriptTags = fs.readFileSync('example/helloworld/index.html', 'utf8')
    .split('\n')
    .filter(function (line) {
        return line.trim().startsWith('<script');
    })
    .map(function (tag) {
        return tag.match(/src="(.+?)"/)[1];
    })
    .filter(function (src) {
        return src.startsWith('../../src/');
    })
    .map(function (src) {
        return src.replace('../../', 'node_modules/highfive.js/');
    })
    .map(function (src) {
        return '<script src="' + src + '"></script>';
    })
    .join('\n');

fs.writeFileSync('dist/index.html', template.replace('{scripts}', scriptTags), 'utf8');