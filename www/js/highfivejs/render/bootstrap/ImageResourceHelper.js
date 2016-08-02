H5.ImageResourceHelper = (function (ImageCache, Object, getDevicePixelRatio, Math) {
    "use strict";

    var GFX_FOLDER = 'gfx/';
    var FILE_EXT = '.png';

    function registerImages(resourceLoader, imgNames, images) {
        imgNames.forEach(function (name) {
            images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
        });
    }

    function registerSprites(resourceLoader, spriteInfoPairs, images) {
        spriteInfoPairs.forEach(function (info) {
            for (var i = 0; i < info.numberOfFrames; i++) {
                var name;
                if (i < 10) {
                    name = info.name + '_000' + i;
                    images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
                } else {
                    name = info.name + '_00' + i;
                    images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
                }
            }
        });
    }

    function processImages(images, width, height, defaultSize) {
        var pixelRatio = getDevicePixelRatio();
        var gfxCache = new ImageCache(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio), defaultSize);

        Object.keys(images).forEach(function (key) {
            gfxCache.add(key, images[key])
        });

        return gfxCache;
    }

    return {
        register: registerImages,
        process: processImages
    };
})(H5.ImageCache, Object, H5.getDevicePixelRatio, Math);