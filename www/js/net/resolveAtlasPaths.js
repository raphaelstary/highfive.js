var resolveAtlasPaths = (function () {
    "use strict";

    var atlases = [
        {
            size: 480,
            count: 1
        }, {
            size: 600,
            count: 1
        }, {
            size: 614,
            count: 1
        }, {
            size: 720,
            count: 1
        }, {
            size: 768,
            count: 1
        }, {
            size: 800,
            count: 1
        }, {
            size: 864,
            count: 1
        }, {
            size: 900,
            count: 1
        }, {
            size: 960,
            count: 1
        }, {
            size: 1024,
            count: 1
        }, {
            size: 1050,
            count: 1
        }, {
            size: 1080,
            count: 1
        }, {
            size: 1136,
            count: 1
        }, {
            size: 1152,
            count: 1
        }, {
            size: 1200,
            count: 1
        }, {
            size: 1280,
            count: 1
        }, {
            size: 1366,
            count: 1
        }, {
            size: 1440,
            count: 1
        }, {
            size: 1600,
            count: 1
        }, {
            size: 1716,
            count: 2
        }, {
            size: 1920,
            count: 2
        }, {
            size: 2048,
            count: 2
        }, {
            size: 2160,
            count: 1
        }, {
            size: 2560,
            count: 1
        }, {
            size: 3200,
            count: 1
        }, {
            size: 3840,
            count: 1
        }
    ];

    var ATLAS = 'atlas';

    function getFileName(i, size) {
        return ATLAS + '_' + i + '_' + size;
    }

    function getFileNames(size, count) {
        var names = [];
        for (var i = 0; i < count; i++) {
            names.push(getFileName(i, size));
        }

        return names;
    }

    function resolveAtlasPaths(width, height) {
        var size = width > height ? width : height;
        for (var i = 0; i < atlases.length; i++) {
            var atlas = atlases[i];
            if (size <= atlas.size) {
                return {
                    paths: getFileTypedNames(getFileNames(atlas.size, atlas.count)),
                    defaultSize: atlas.size
                };
            }
        }

        var last = atlases[atlases.length - 1];
        return {
            paths: getFileTypedNames(getFileNames(last.size, last.count)),
            defaultSize: last.size
        };
    }

    function getFileTypedNames(names) {
        var aggregatedPaths = [];

        names.forEach(function (name) {
            aggregatedPaths.push({
                gfx: 'gfx/' + name + '.png',
                data: 'data/' + name + '.json'
            });
        });

        return aggregatedPaths;
    }

    return resolveAtlasPaths;
})();