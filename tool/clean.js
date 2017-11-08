'use strict';

const fs = require('fs');

function removeDirectory(path) {
    return new Promise((fulfill, reject) => {
        fs.rmdir(path, error => {
            if (error) {
                if (error.code === 'ENOTEMPTY') {
                    return removeFiles(path)
                        .then(removeDirectory.bind(undefined, path))
                        .then(fulfill)
                        .catch(reject);
                }
                return reject(error);
            }
            fulfill();
        });
    });
}

function removeFiles(dirPath) {
    return new Promise((fulfill, reject) => {
        fs.readdir(dirPath, (error, files) => {
            Promise.all(files.map(file => remove(dirPath + '/' + file)))
                .then(fulfill)
                .catch(reject);
        });
    });
}

function remove(filePath) {
    return new Promise((fulfill, reject) => {
        fs.unlink(filePath, error => {
            if (error) {
                if (error.code === 'EPERM') {
                    return removeDirectory(filePath).then(fulfill).catch(reject);
                }
                return reject(error);
            }
            fulfill();
        });
    });
}

removeDirectory('dist').catch(error => {
    if (error.code === 'ENOENT') {
        return console.log('no dist/ dir');
    }
    console.log('error: ' + error);
});