var Sprites = (function (Sprite) {
    "use strict";

    function createNew(atlasMapper, imgPath, lastFrameIndex, loop) {
        var frames = [];
        for (var i = 0; i <= lastFrameIndex; i++) {
            if (i < 10) {

                frames.push(atlasMapper.get(imgPath + "_000" + i));
            } else {
                frames.push(atlasMapper.get(imgPath + "_00" + i));
            }
        }
        return new Sprite(frames, loop);
    }

    return {
        get: createNew
    };
})(Sprite);