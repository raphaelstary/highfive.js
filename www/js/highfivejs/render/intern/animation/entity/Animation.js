H5.Animation = (function () {
    "use strict";

    function Animation(startValue, endValue, valueRangeLength, duration, timingFn, loop) {
        this.start = startValue;
        this.end = endValue;
        this.length = valueRangeLength;
        this.duration = duration;
        this.timingFn = timingFn;
        this.loop = loop !== undefined ? loop : false;
    }

    return Animation;
})();