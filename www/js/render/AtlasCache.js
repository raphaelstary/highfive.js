var AtlasCache = (function (SubImage, Math, getDevicePixelRatio, iterateEntries) {
    "use strict";

    function AtlasCache(width, height, scale) {
        this.atlasDict = {};
        this.defaultScaleFactor = scale || 1;
        this.width = width;
        this.height = height;
    }

    AtlasCache.prototype.init = function (atlasInfos, defaultSize) {
        var self = this;
        this.defaultSize = defaultSize;
        var scale = this.defaultScaleFactor = this.height / defaultSize;
        atlasInfos.forEach(function (atlasInfoWrapper) {
            var atlas = atlasInfoWrapper.atlas;
            var info = atlasInfoWrapper.info;
            info.frames.forEach(function (elem) {
                self.atlasDict[elem.filename] = self._createSubImage(elem, atlas, scale);
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
        var scale = this.defaultScaleFactor = event.height / this.defaultSize;
        iterateEntries(this.atlasDict, function (subImage) {
            subImage.scaledOffSetX = Math.floor(subImage.offSetX * scale);
            subImage.scaledOffSetY = Math.floor(subImage.offSetY * scale);
            subImage.scaledTrimmedWidth = Math.floor(subImage.trimmedWidth * scale);
            subImage.scaledTrimmedHeight = Math.floor(subImage.trimmedHeight * scale);
        });
    };

    return AtlasCache;
})(SubImage, Math, getDevicePixelRatio, iterateEntries);