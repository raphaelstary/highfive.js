H5.createAtlasPaths = (function () {
    "use strict";

    function createAtlasPaths(baseName, gfxPath, dataPath, gfxFormat, dataFormat) {

        var atlases = [];

        function getFileName(i) {
            return (baseName || 'atlas') + '_' + i;
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
                    gfx: (gfxPath || 'gfx/') + name + (gfxFormat || '.png'),
                    data: (dataPath || 'data/') + name + (dataFormat || '.json')
                });
            });

            return aggregatedPaths;
        }

        return {
            add: function (size, count) {

                atlases.push({
                    size: size,
                    count: count || 1
                });

                return this;
            },
            getResolver: function () {
                atlases.sort(function (a, b) {
                    return a.size - b.size;
                });

                return resolveAtlasPaths;
            }
        };
    }

    return createAtlasPaths;
})();