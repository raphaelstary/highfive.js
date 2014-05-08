var AtlasMapper = (function (SubImage) {
    "use strict";

    var X_TILES = 320;
//        Y_TILES = 480;

    function AtlasMapper(referenceWidth) {
        this.referenceWidth = referenceWidth;
        this.atlasDict = {};
    }

    AtlasMapper.prototype.init = function (atlasInfo, screenWidth) {
        var factor = this._getActualTileWidth(screenWidth) / this.referenceWidth;
        var self = this;
        atlasInfo.frames.forEach(function (elem) {
            self.atlasDict[elem.filename] = self._createSubImage(elem, factor);
        });
    };

    AtlasMapper.prototype.resize = function (width, height, factorWidth) {

        for (var key in this.atlasDict) {
            if (!this.atlasDict.hasOwnProperty(key)) {
                continue;
            }
            var elem = this.atlasDict[key];

            if (elem instanceof SubImage) {
                this._updateAttributes(elem, factorWidth);

            } else if (elem instanceof Array) {
                var self = this;
                elem.forEach(function (subImage) {
                    self._updateAttributes(subImage, factorWidth);
                });

            } else {
                throw "strange atlas mapper behavior: instance of " + (typeof elem) + " in atlas dict";
            }
        }
    };

    AtlasMapper.prototype._getActualTileWidth = function (screenWidth) {
        return Math.floor(screenWidth / X_TILES);
    };

    AtlasMapper.prototype._updateAttributes = function (elem, factorWidth) {
        elem.offSetX = Math.floor(elem.offSetX * factorWidth);
        elem.offSetY = Math.floor(elem.offSetY * factorWidth);
    };

    AtlasMapper.prototype._getOffSetFromCenterX = function (elem, actualRefTileFactor) {
        return Math.floor((elem.spriteSourceSize.x - elem.sourceSize.w * 0.5) * actualRefTileFactor);
    };

    AtlasMapper.prototype._getOffSetFromCenterY = function (elem, actualRefTileFactor) {
        return Math.floor((elem.spriteSourceSize.y - elem.sourceSize.h * 0.5) * actualRefTileFactor);
    };

    AtlasMapper.prototype._createSubImage = function (elem, factor) {
        return new SubImage(elem.frame.x, elem.frame.y, elem.frame.w, elem.frame.h,
            this._getOffSetFromCenterX(elem, factor), this._getOffSetFromCenterY(elem, factor),
            Math.floor(elem.sourceSize.w / this.referenceWidth),
            Math.floor(elem.sourceSize.h / this.referenceWidth),
                elem.spriteSourceSize.w / this.referenceWidth,
                elem.spriteSourceSize.h / this.referenceWidth);
    };

    AtlasMapper.prototype.get = function (key) {
        return this.atlasDict[key];
    };

    return AtlasMapper;
})(SubImage);