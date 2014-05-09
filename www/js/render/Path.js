var Path = (function () {
    "use strict";

    function Path(startX, startY, endX, endY, length, duration, timingFn, loop) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.length = length;
        this.duration = duration;
        this.timingFn = timingFn;
        this.loop = loop !== undefined ? loop : false;
    }

    return Path;
})();