H5.Animations = (function (Animation, Math) {
    "use strict";

    function createNew(startValue, endValue, speed, spacingFn, loop) {
        var length = Math.abs(startValue - endValue);
        if (endValue < startValue) {
            length = -length;
        }
        return new Animation(startValue, endValue, length, speed, spacingFn, loop);
    }

    return {
        get: createNew
    };
})(H5.Animation, Math);