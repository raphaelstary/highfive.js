H5.Sprites = (function (Sprite) {
    "use strict";

    function createNew(gfxCache, imgPath, numberOfFrames, loop) {
        var frames = [];
        for (var i = 0; i < numberOfFrames; i++) {
            if (i < 10) {

                frames.push(gfxCache.get(imgPath + "_000" + i));
            } else {
                frames.push(gfxCache.get(imgPath + "_00" + i));
            }
        }
        return new Sprite(frames, loop);
    }

    return {
        get: createNew
    };
})(H5.Sprite);