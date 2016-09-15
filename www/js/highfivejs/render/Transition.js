H5.Transition = (function (Math) {
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

        var period = duration * .3, s = changeInValue < Math.abs(changeInValue) ? period / 4 :
        period / (2 * Math.PI) * Math.asin(changeInValue / changeInValue);

        return changeInValue * Math.pow(2, -10 * currentTime) *
            Math.sin((currentTime * duration - s) * (2 * Math.PI) / period) + changeInValue + startValue;
    }

    function elasticEasingOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0) {
            return startValue;
        }
        if ((currentTime /= duration) == 1) {
            return startValue + changeInValue;
        }
        var period = duration * .3;
        var s;
        if (changeInValue < Math.abs(changeInValue)) {
            s = period / 4;
        } else {
            s = period / (2 * Math.PI) * Math.asin(changeInValue / changeInValue);
        }
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
        return changeInValue / 2 * (--currentTime * currentTime * currentTime * currentTime * currentTime + 1) +
            startValue;
    }

    function sinusoidalEasingOutAndIn(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration / 2) < 1) return changeInValue / 2 * (Math.sin(Math.PI * currentTime / 2) ) +
            startValue;
        return -changeInValue / 2 * (Math.cos(Math.PI * --currentTime / 2) - 2) + startValue;
    }

    function sinusoidalEasingIn(currentTime, startValue, changeInValue, duration) {
        return -changeInValue / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + startValue;
    }

    function sinusoidalEasingOut(currentTime, startValue, changeInValue, duration) {
        return changeInValue * Math.sin(currentTime / duration * (Math.PI / 2)) + startValue;
    }

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    function sinusoidalEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        return -changeInValue / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + startValue;
    }

    function bouncingEasingOut(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration) < (1 / 2.75)) {
            return changeInValue * (7.5625 * currentTime * currentTime) + startValue;
        } else if (currentTime < (2 / 2.75)) {
            return changeInValue * (7.5625 * (currentTime -= (1.5 / 2.75)) * currentTime + .75) + startValue;
        } else if (currentTime < (2.5 / 2.75)) {
            return changeInValue * (7.5625 * (currentTime -= (2.25 / 2.75)) * currentTime + .9375) + startValue;
        } else {
            return changeInValue * (7.5625 * (currentTime -= (2.625 / 2.75)) * currentTime + .984375) + startValue;
        }
    }

    function easeInBack(currentTime, startValue, changeInValue, duration) {
        return changeInValue * (currentTime /= duration) * currentTime * ((1.70158 + 1) * currentTime - 1.70158) +
            startValue;
    }

    function easeOutBack(currentTime, startValue, changeInValue, duration) {
        return changeInValue *
            ((currentTime = currentTime / duration - 1) * currentTime * ((1.70158 + 1) * currentTime + 1.70158) + 1) +
            startValue;
    }

    function easeInOutBack(currentTime, startValue, changeInValue, duration) {
        var s = 1.70158;
        if ((currentTime /= duration / 2) < 1)
            return changeInValue / 2 * (currentTime * currentTime * (((s *= (1.525)) + 1) * currentTime - s)) +
                startValue;
        return changeInValue / 2 * ((currentTime -= 2) * currentTime * (((s *= (1.525)) + 1) * currentTime + s) + 2) +
            startValue;
    }

    return {
        LINEAR: linearTweening,

        EASE_OUT_BOUNCE: bouncingEasingOut,

        EASE_OUT_ELASTIC: elasticEasingOut,
        EASE_IN_OUT_ELASTIC: elasticEasingInAndOut,

        EASE_IN_EXPO: exponentialEasingIn,
        EASE_OUT_EXPO: exponentialEasingOut,
        EASE_IN_OUT_EXPO: exponentialEasingInAndOut,

        EASE_IN_QUAD: quadraticEasingIn,
        EASE_OUT_QUAD: quadraticEasingOut,
        EASE_IN_OUT_QUAD: quadraticEasingInAndOut,

        EASE_OUT_IN_QUINT: quinticEasingOutAndIn,

        EASE_IN_SIN: sinusoidalEasingIn,
        EASE_OUT_SIN: sinusoidalEasingOut,
        EASE_OUT_IN_SIN: sinusoidalEasingOutAndIn,
        EASE_IN_OUT_SIN: sinusoidalEasingInAndOut,

        EASE_IN_BACK: easeInBack,
        EASE_OUT_BACK: easeOutBack,
        EASE_IN_OUT_BACK: easeInOutBack
    };
})(Math);