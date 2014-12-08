var AtlasResourceHelper = (function (AtlasCache, resolveAtlasPaths, screenWidth, screenHeight, getDevicePixelRatio) {
    "use strict";

    var defaultSize = 3840;

    function registerAtlases(resourceLoader, atlases) {
        var pixelRatio = getDevicePixelRatio();
        var info = resolveAtlasPaths(screenWidth * pixelRatio, screenHeight * pixelRatio);
        defaultSize = info.defaultSize;
        info.paths.forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });
    }

    function processAtlases(atlases) {
        var gfxCache = new AtlasCache();
        gfxCache.init(atlases, defaultSize);

        return gfxCache;
    }

    return {
        register: registerAtlases,
        process: processAtlases
    };
})(AtlasCache, resolveAtlasPaths, window.screen.availWidth, window.screen.availHeight, getDevicePixelRatio);