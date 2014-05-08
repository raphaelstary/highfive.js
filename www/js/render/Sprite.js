var Sprite = (function () {
    "use strict";

    function Sprite(frames) {
        this.frames = frames;
        this.current = 0;
    }

    return Sprite;
})();