H5.Sprite = (function () {
    'use strict';

    function Sprite(frames, loop) {
        this.frames = frames;
        this.loop = loop === undefined ? true : loop;
    }

    return Sprite;
})();
