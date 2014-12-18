var ImageCache = (function (ImageWrapper, screen, iterateEntries, getDevicePixelRatio) {
    "use strict";

    function ImageCache(baseScale) {
        this.baseScale = baseScale || 3840;
        this.imgDict = {};
        this.defaultScaleFactor = screen.availHeight * getDevicePixelRatio() / this.baseScale;
    }

    ImageCache.prototype.add = function (key, img) {
        this.imgDict[key] = new ImageWrapper(img, img.width, img.height, this.defaultScaleFactor);
    };

    ImageCache.prototype.get = function (key) {
        return this.imgDict[key];
    };

    ImageCache.prototype.resize = function (event) {
        var newScaleFactor = event.height / this.baseScale;
        iterateEntries(this.imgDict, function (img) {
            img.scale = newScaleFactor;
        });
    };

    return ImageCache;
})(ImageWrapper, window.screen, iterateEntries, getDevicePixelRatio);