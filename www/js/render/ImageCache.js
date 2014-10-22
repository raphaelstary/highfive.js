var ImageCache = (function (ImageWrapper, screen) {
    "use strict";

    function ImageCache(baseScale) {
        this.baseScale = baseScale || 3840;
        this.imgDict = {};
        this.defaultScaleFactor = screen.availHeight / this.baseScale;
    }

    ImageCache.prototype.add = function (key, img) {
        this.imgDict[key] = new ImageWrapper(img, img.width, img.height, this.defaultScaleFactor);
    };

    ImageCache.prototype.get = function (key) {
        return this.imgDict[key];
    };

    ImageCache.prototype.resize = function () {
        var newScaleFactor = screen.availHeight / this.baseScale;
        for (var key in this.imgDict) {
            var texture = this.imgDict[key];
            texture.scale = newScaleFactor;
        }
    };

    return ImageCache;
})(ImageWrapper, window.screen);