var Transition = (function () {
    "use strict";

    function linearTweening(currentTime, startValue, changeInValue, duration) {
        return changeInValue * currentTime / duration + startValue;
    }

    function exponentialEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0)
            return startValue;
        if (currentTime == duration)
            return startValue + changeInValue;
        if ((currentTime /= duration / 2) < 1)
            return changeInValue / 2 * Math.pow(2, 10 * (currentTime - 1)) + startValue;

        return changeInValue / 2 * (-Math.pow(2, -10 * --currentTime) + 2) + startValue;
    }

    function elasticEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0)
            return startValue;

        if ((currentTime /= duration) == 1)
            return startValue + changeInValue;

        var period = duration * .3,
            s = changeInValue < Math.abs(changeInValue) ?
                period / 4 :
                period / (2 * Math.PI) * Math.asin(changeInValue / changeInValue);

        return changeInValue * Math.pow(2, -10 * currentTime) *
            Math.sin((currentTime * duration - s) * (2 * Math.PI) / period) + changeInValue + startValue;
    }

    function quadraticEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration / 2) < 1) {
            return changeInValue / 2 * currentTime * currentTime + startValue;
        }

        return -changeInValue / 2 * ((--currentTime) * (currentTime - 2) - 1) + startValue;
    }

    function exponentialEasingIn(currentTime, startValue, changeInValue, duration) {
        if (currentTime != 0) {
            return changeInValue * Math.pow(2, 10 * (currentTime / duration - 1)) + startValue;
        }
        return startValue;
    }

    return {
        LINEAR: linearTweening,
        EASE_IN_OUT_EXPO: exponentialEasingInAndOut,
        EASE_IN_OUT_ELASTIC: elasticEasingInAndOut,
        EASE_IN_OUT_QUAD: quadraticEasingInAndOut,
        EASE_IN_EXPO: exponentialEasingIn
    }
})();