var Sprites = (function (Sprite) {
    "use strict";

    function createNew(atlasMapper, imgPath, numberOfFrames, loop) {
        var frames = [];
        for (var i = 0; i < numberOfFrames; i++) {
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