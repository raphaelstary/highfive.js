var AtlasCache = (function (SubImage, Math) {
    "use strict";

    function AtlasCache() {
        this.atlasDict = {};
    }

    AtlasCache.prototype.init = function (atlasInfos) {
        var self = this;
        atlasInfos.forEach(function (atlasInfoWrapper) {
            var atlas = atlasInfoWrapper.atlas;
            var info = atlasInfoWrapper.info;
            info.frames.forEach(function (elem) {
                self.atlasDict[elem.filename] = self._createSubImage(elem, atlas);
            });
        });
    };

    AtlasCache.prototype._getOffSetFromCenterX = function (elem) {
        return Math.floor(elem.spriteSourceSize.x - elem.sourceSize.w * 0.5);
    };

    AtlasCache.prototype._getOffSetFromCenterY = function (elem) {
        return Math.floor(elem.spriteSourceSize.y - elem.sourceSize.h * 0.5);
    };

    AtlasCache.prototype._createSubImage = function (elem, atlas) {
        return new SubImage(elem.frame.x, elem.frame.y, elem.frame.w, elem.frame.h, this._getOffSetFromCenterX(elem),
            this._getOffSetFromCenterY(elem), elem.spriteSourceSize.w, elem.spriteSourceSize.h, atlas);
    };

    AtlasCache.prototype.get = function (key) {
        return this.atlasDict[key];
    };

    return AtlasCache;
})(SubImage, Math);