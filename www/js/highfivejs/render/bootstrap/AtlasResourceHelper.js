H5.AtlasResourceHelper = (function (AtlasCache, screenWidth, screenHeight, getDevicePixelRatio, Math) {
    "use strict";

    var defaultSize;
    var pixelRatio = getDevicePixelRatio();

    function registerAtlases(resourceLoader, atlases, isMobile, resolveAtlasPaths) {
        var info = resolveAtlasPaths(Math.floor(screenWidth * pixelRatio), Math.floor(screenHeight * pixelRatio),
            isMobile);
        defaultSize = info.defaultSize;
        info.paths.forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });
    }

    function processAtlases(atlases, width, height) {
        var gfxCache = new AtlasCache(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio), defaultSize);
        gfxCache.init(atlases);

        return gfxCache;
    }

    function lowRezProcess(atlases, width, height) {
        var gfxCache = new AtlasCache(width, height, defaultSize);
        gfxCache.init(atlases);

        return gfxCache;
    }

    return {
        register: registerAtlases,
        process: processAtlases,
        processLowRez: lowRezProcess
    };
})(H5.AtlasCache, window.screen.availWidth, window.screen.availHeight, H5.getDevicePixelRatio, Math);