var AtlasResourceHelper = (function (AtlasCache, resolveAtlasPaths, screenWidth, screenHeight, getDevicePixelRatio) {
    "use strict";

    var defaultSize;
    var pixelRatio = getDevicePixelRatio();

    function registerAtlases(resourceLoader, atlases) {
        var info = resolveAtlasPaths(screenWidth * pixelRatio, screenHeight * pixelRatio);
        defaultSize = info.defaultSize;
        info.paths.forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });
    }

    function processAtlases(atlases, width, height) {
        var gfxCache = new AtlasCache(width * pixelRatio, height * pixelRatio, defaultSize);
        gfxCache.init(atlases);

        return gfxCache;
    }

    return {
        register: registerAtlases,
        process: processAtlases
    };
})(AtlasCache, resolveAtlasPaths, window.screen.availWidth, window.screen.availHeight, getDevicePixelRatio);