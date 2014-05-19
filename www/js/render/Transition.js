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

    function exponentialEasingOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == duration) {
            return startValue + changeInValue;
        } else {
            return changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) + startValue;
        }
    }

    function quadraticEasingIn(currentTime, startValue, changeInValue, duration) {
        return changeInValue * (currentTime /= duration) * currentTime + startValue;
    }

    function quadraticEasingOut(currentTime, startValue, changeInValue, duration) {
        return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
    }

//    not working :( ... don't copy random shit from the fucking internet
    function quinticEasingOutAndIn(currentTime, startValue, changeInValue, duration) {
        currentTime /= duration / 2;
        return changeInValue / 2 * (--currentTime * currentTime * currentTime * currentTime * currentTime + 1) + startValue;
    }

    function sinusoidalEasingOutAndIn(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * (Math.sin(Math.PI * t / 2) ) + b;
        return -c / 2 * (Math.cos(Math.PI * --t / 2) - 2) + b;
    }

    function sinusoidalEasingIn(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }

    function sinusoidalEasingOut(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }

    return {
        LINEAR: linearTweening,
        EASE_IN_OUT_EXPO: exponentialEasingInAndOut,
        EASE_IN_OUT_ELASTIC: elasticEasingInAndOut,
        EASE_IN_OUT_QUAD: quadraticEasingInAndOut,
        EASE_IN_EXPO: exponentialEasingIn,
        EASE_OUT_EXPO: exponentialEasingOut,
        EASE_IN_QUAD: quadraticEasingIn,
        EASE_OUT_QUAD: quadraticEasingOut,
        EASE_OUT_IN_QUINT: quinticEasingOutAndIn,
        EASE_OUT_IN_SIN: sinusoidalEasingOutAndIn,
        EASE_IN_SIN: sinusoidalEasingIn,
        EASE_OUT_SIN: sinusoidalEasingOut
    }
})();