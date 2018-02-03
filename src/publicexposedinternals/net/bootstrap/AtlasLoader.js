H5.AtlasLoader = (function (AtlasResourceHelper, createAtlasPaths, Device, userAgent, width, height) {
    'use strict';

    var atlasPaths;
    var atlases = [];
    return {
        register: function (registerAtlases) {
            atlasPaths = registerAtlases(createAtlasPaths);
        },
        load: function (resourceLoader) {
            var isMobile = new Device(userAgent, 1, 1, 1).isMobile;
            AtlasResourceHelper.register(resourceLoader, atlases, isMobile, atlasPaths);
        },
        process: function (services) {
            services.gfxCache = AtlasResourceHelper.process(atlases, width, height);
        }
    };
})(H5.AtlasResourceHelper, H5.createAtlasPaths, H5.Device, window.navigator.userAgent, window.innerWidth,
    window.innerHeight);
