H5.FixedRezAtlasLoader = (function (AtlasResourceHelper, createAtlasPaths, Device, userAgent) {
    "use strict";

    var fixedWidth;
    var fixedHeight;
    var atlases = [];
    return {
        register: function (width, height) {
            fixedWidth = width;
            fixedHeight = height;
        },
        load: function (resourceLoader) {
            var isMobile = new Device(userAgent, 1, 1, 1).isMobile;
            AtlasResourceHelper.register(resourceLoader, atlases, isMobile,
                createAtlasPaths().add(fixedHeight).getResolver());
        },
        process: function (services) {
            services.gfxCache = AtlasResourceHelper.processFixedRez(atlases, fixedWidth, fixedHeight);
        }
    };
})(H5.AtlasResourceHelper, H5.createAtlasPaths, H5.Device, window.navigator.userAgent);