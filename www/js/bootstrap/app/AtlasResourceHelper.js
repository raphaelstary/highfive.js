var AtlasResourceHelper = (function (AtlasCache, resolveAtlasPaths, screenWidth, screenHeight) {
    "use strict";

    function registerAtlases(resourceLoader, atlases) {
        resolveAtlasPaths(screenWidth, screenHeight).forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });
    }

    function processAtlases(atlases) {
        var gfxCache = new AtlasCache();
        gfxCache.init(atlases);

        return gfxCache;
    }

    return {
        register: registerAtlases,
        process: processAtlases
    };
})(AtlasCache, resolveAtlasPaths, window.screen.availWidth, window.screen.availHeight);