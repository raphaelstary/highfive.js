var Drawables = (function (Drawable) {
    "use strict";

    function createNew(atlasMapper, seed, x, y, imgPathName, zIndex) {
        var subImage = atlasMapper.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, subImage, zIndex);
    }

    return {
        get: createNew
    };
})(Drawable);