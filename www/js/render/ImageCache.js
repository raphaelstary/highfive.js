var ImageCache = (function (ImageWrapper, iterateEntries, getDevicePixelRatio) {
    "use strict";

    function ImageCache(width, height, baseScale) {
        this.baseScale = baseScale || 3840;
        this.imgDict = {};
        this.defaultScaleFactor = height / this.baseScale;
    }

    ImageCache.prototype.add = function (key, img) {
        this.imgDict[key] = new ImageWrapper(img, img.width, img.height, this.defaultScaleFactor);
    };

    ImageCache.prototype.get = function (key) {
        return this.imgDict[key];
    };

    ImageCache.prototype.resize = function (event) {
        var newScaleFactor = this.defaultScaleFactor = event.height / this.baseScale;
        iterateEntries(this.imgDict, function (img) {
            img.scale = newScaleFactor;
        });
    };

    return ImageCache;
})(ImageWrapper, iterateEntries, getDevicePixelRatio);