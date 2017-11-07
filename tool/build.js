'use strict';

let fs = require('fs');
fs.mkdirSync('dist');

require('./generateHtml');
require('./minify');