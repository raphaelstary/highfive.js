var fs = require('fs');

function removeDirectory(path) {
    return new Promise(function (fulfill, reject) {
        fs.rmdir(path, function (error) {
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
    return new Promise(function (fulfill, reject) {
        fs.readdir(dirPath, function (error, files) {
            Promise.all(files.map(function (file) {
                    return remove(dirPath + '/' + file);
                }))
                .then(fulfill)
                .catch(reject);
        });
    });
}

function remove(filePath) {
    return new Promise(function (fulfill, reject) {
        fs.unlink(filePath, function (error) {
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

removeDirectory('dist');