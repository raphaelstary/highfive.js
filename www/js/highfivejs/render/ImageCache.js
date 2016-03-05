H5.ImageCache = (function (ImageWrapper, iterateEntries) {
    "use strict";

    function ImageCache(width, height, defaultScreenHeight) {
        this.defaultScreenHeight = defaultScreenHeight || 3840;
        this.imgDict = {};
        this.defaultScaleFactor = height / this.defaultScreenHeight;
    }

    ImageCache.prototype.add = function (key, img) {
        this.imgDict[key] = new ImageWrapper(img, img.width, img.height, this.defaultScaleFactor);
    };

    ImageCache.prototype.get = function (key) {
        return this.imgDict[key];
    };

    ImageCache.prototype.resize = function (event) {
        var newScaleFactor = this.defaultScaleFactor = event.height / this.defaultScreenHeight;
        iterateEntries(this.imgDict, function (img) {
            img.scale = newScaleFactor;
        });
    };

    return ImageCache;
})(H5.ImageWrapper, H5.iterateEntries);