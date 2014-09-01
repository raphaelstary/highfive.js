var TextureCache = (function (Texture, screen) {
    "use strict";

    function TextureCache() {
        this.textureDict = {};
    }

    var baseScale = 3840;
    var defaultScaleFactor = 0.28125; // 1080p

    TextureCache.prototype.add = function (key, img) {
        this.textureDict[key] = new Texture(img, img.width, img.height, defaultScaleFactor);
    };

    TextureCache.prototype.get = function (key) {
        return this.textureDict[key];
    };

    TextureCache.prototype.resize = function (width, height) {
        var newScaleFactor = screen.availHeight / baseScale;
        for (var key in this.textureDict) {
            var texture = this.textureDict[key];
            texture.scale = newScaleFactor;
        }
    };

    return TextureCache;
})(Texture, window.screen);