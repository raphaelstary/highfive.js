var resolveAtlasPaths = (function () {
    "use strict";

    var atlases = [
        {size: 480, count: 1},
        {size: 600, count: 2},
        {size: 614, count: 2},
        {size: 720, count: 3},
        {size: 768, count: 3},
        {size: 800, count: 3},
        {size: 864, count: 3},
        {size: 900, count: 4},
        {size: 960, count: 4},
        {size: 1024, count: 5},
        {size: 1050, count: 5},
        {size: 1080, count: 5},
        {size: 1136, count: 6},
        {size: 1152, count: 6},
        {size: 1200, count: 6},
        {size: 1280, count: 7},
        {size: 1366, count: 8},
        {size: 1440, count: 9},
        {size: 1600, count: 12},
        {size: 1716, count: 13},
        {size: 1920, count: 16},
        {size: 2048, count: 22},
        {size: 2160, count: 1},
        {size: 2560, count: 1},
        {size: 3200, count: 1},
        {size: 3840, count: 2}
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
        for (var i = 0; i < atlases.length; i++) {
            var atlas = atlases[i];
            if (height <= atlas.size) {
                return getFileTypedNames(getFileNames(atlas.size, atlas.count));
            }
        }

        var last = atlases[atlases.length - 1];
        return getFileTypedNames(getFileNames(last.size, last.count));
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