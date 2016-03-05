H5.AtlasCache = (function (SubImage, Math, iterateEntries) {
    "use strict";

    function AtlasCache(width, height, defaultScreenHeight) {
        this.defaultScreenHeight = defaultScreenHeight || 3840;
        this.atlasDict = {};
        this.defaultScaleFactor = height / this.defaultScreenHeight;
    }

    AtlasCache.prototype.init = function (atlasInfos) {
        var self = this;
        atlasInfos.forEach(function (atlasInfoWrapper) {
            var atlas = atlasInfoWrapper.atlas;
            var info = atlasInfoWrapper.info;
            info.frames.forEach(function (elem) {
                self.atlasDict[elem.filename] = self._createSubImage(elem, atlas, self.defaultScaleFactor);
            });
        });
    };

    AtlasCache.prototype._getOffSetFromCenterX = function (elem, scale) {
        return Math.floor((elem.spriteSourceSize.x - elem.sourceSize.w * 0.5) * scale);
    };

    AtlasCache.prototype._getOffSetFromCenterY = function (elem, scale) {
        return Math.floor((elem.spriteSourceSize.y - elem.sourceSize.h * 0.5) * scale);
    };

    AtlasCache.prototype._createSubImage = function (elem, atlas, scale) {
        return new SubImage(elem.frame.x, elem.frame.y, elem.frame.w, elem.frame.h, this._getOffSetFromCenterX(elem, 1),
            this._getOffSetFromCenterY(elem, 1), elem.spriteSourceSize.w, elem.spriteSourceSize.h,
            this._getOffSetFromCenterX(elem, scale), this._getOffSetFromCenterY(elem, scale),
            elem.spriteSourceSize.w * scale, elem.spriteSourceSize.h * scale, atlas);
    };

    AtlasCache.prototype.get = function (key) {
        return this.atlasDict[key];
    };

    AtlasCache.prototype.resize = function (event) {
        var scale = this.defaultScaleFactor = event.height / this.defaultScreenHeight;
        iterateEntries(this.atlasDict, function (subImage) {
            subImage.scaledOffSetX = Math.floor(subImage.offSetX * scale);
            subImage.scaledOffSetY = Math.floor(subImage.offSetY * scale);
            subImage.scaledTrimmedWidth = Math.floor(subImage.trimmedWidth * scale);
            subImage.scaledTrimmedHeight = Math.floor(subImage.trimmedHeight * scale);
        });
    };

    return AtlasCache;
})(H5.SubImage, Math, H5.iterateEntries);