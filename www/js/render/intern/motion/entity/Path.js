var Path = (function () {
    "use strict";

    function Path(curve, duration, timingFn, loop) {
        this.curve = curve;
        this.duration = duration;
        this.timingFn = timingFn;
        this.loop = loop !== undefined ? loop : false;
    }

    return Path;
})();