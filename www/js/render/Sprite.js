var Sprite = (function () {
    "use strict";

    function Sprite(frames, loop) {
        this.frames = frames;
        this.current = 0;
        this.loop = loop;
    }

    return Sprite;
})();