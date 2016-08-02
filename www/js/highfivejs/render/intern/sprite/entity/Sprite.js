H5.Sprite = (function () {
    "use strict";

    function Sprite(frames, loop) {
        this.frames = frames;
        this.loop = loop !== undefined ? loop : true;
    }

    return Sprite;
})();