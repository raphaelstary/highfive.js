H5.FixedRezAtlasLoader = (function (AtlasResourceHelper, createAtlasPaths, Device, userAgent) {
    'use strict';

    var fixedWidth;
    var fixedHeight;
    var atlases = [];

    var baseName;
    var gfxPath;
    var dataPath;
    var gfxExt;
    var dataExt;

    return {
        register: function (width, height, optionalBaseName, optionalGfxPath, optionalDataPath, optionalGfxExtension,
            optionalDataExtension) {
            fixedWidth = width;
            fixedHeight = height;
            baseName = optionalBaseName;
            gfxPath = optionalGfxPath;
            dataPath = optionalDataPath;
            gfxExt = optionalGfxExtension;
            dataExt = optionalDataExtension;
        },
        load: function (resourceLoader) {
            var isMobile = new Device(userAgent, 1, 1, 1).isMobile;
            AtlasResourceHelper.register(resourceLoader, atlases, isMobile,
                createAtlasPaths(baseName, gfxPath, dataPath, gfxExt, dataExt).add().getResolver());
        },
        process: function (services) {
            services.gfxCache = AtlasResourceHelper.processFixedRez(atlases, fixedWidth, fixedHeight);
        }
    };
})(H5.AtlasResourceHelper, H5.createAtlasPaths, H5.Device, window.navigator.userAgent);
