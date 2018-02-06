H5.createAtlasPaths = (function () {
    'use strict';

    var DEFAULT_ATLAS_NAME = 'atlas';
    var DEFAULT_GFX_PATH = 'gfx/';
    var DEFAULT_DATA_PATH = 'data/';
    var DEFAULT_GFX_EXTENSION = '.png';
    var DEFAULT_DATA_EXTENSION = '.json';

    function createAtlasPaths(optionalBaseName, optionalGfxPath, optionalDataPath, optionalGfxExtension,
        optionalDataExtension) {

        var atlases = [];

        function getFileName(i, size) {
            if (size) {
                return (optionalBaseName || DEFAULT_ATLAS_NAME) + '_' + size + '_' + i;
            }
            return (optionalBaseName || DEFAULT_ATLAS_NAME) + '_' + i;
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
                    gfx: (optionalGfxPath || DEFAULT_GFX_PATH) + name + (optionalGfxExtension || DEFAULT_GFX_EXTENSION),
                    data: (optionalDataPath || DEFAULT_DATA_PATH) + name + (optionalDataExtension
                        || DEFAULT_DATA_EXTENSION)
                });
            });

            return aggregatedPaths;
        }

        return {
            add: function (size, optionalCount) {

                atlases.push({
                    size: size,
                    count: optionalCount || 1
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
