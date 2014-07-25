var AtlasMapper = (function (SubImage) {
    "use strict";

    function AtlasMapper() {
        this.atlasDict = {};
    }

    AtlasMapper.prototype.init = function (atlasInfo) {
        var self = this;
        atlasInfo.frames.forEach(function (elem) {
            self.atlasDict[elem.filename] = self._createSubImage(elem);
        });
    };

    AtlasMapper.prototype._getOffSetFromCenterX = function (elem) {
        return Math.floor(elem.spriteSourceSize.x - elem.sourceSize.w * 0.5);
    };

    AtlasMapper.prototype._getOffSetFromCenterY = function (elem) {
        return Math.floor(elem.spriteSourceSize.y - elem.sourceSize.h * 0.5);
    };

    AtlasMapper.prototype._createSubImage = function (elem) {
        return new SubImage(elem.frame.x, elem.frame.y, elem.frame.w, elem.frame.h,
            this._getOffSetFromCenterX(elem),
            this._getOffSetFromCenterY(elem),
            elem.spriteSourceSize.w,
            elem.spriteSourceSize.h);
    };

    AtlasMapper.prototype.get = function (key) {
        return this.atlasDict[key];
    };

    return AtlasMapper;
})(SubImage);