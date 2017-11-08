'use strict';

const fs = require('fs');
fs.mkdirSync('dist');

require('./generateHtml');
require('./minify');