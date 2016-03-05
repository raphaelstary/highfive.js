H5.PropertyAnimations = (function (Animations) {
    "use strict";

    function PropertyAnimations(animations, animationHelper) {
        this.animations = animations;
        this.animationHelper = animationHelper;
    }

    PropertyAnimations.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'alpha', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'alpha', valuePairs, loop);
    };

    PropertyAnimations.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'rotation', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'rotation', valuePairs, loop);
    };

    PropertyAnimations.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'scale', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'scale', valuePairs, loop);
    };

    PropertyAnimations.prototype.__animateProperty = function (drawable, propertyKey, value, duration, easing, loop,
        callback) {
        var animation = Animations.get(drawable[propertyKey], value, duration, easing, loop);

        this.animations.animate(drawable, function (value) {
            drawable[propertyKey] = value;
        }, animation, callback);

        return animation;
    };

    PropertyAnimations.prototype.__animatePropertyPattern = function (drawable, propertyKey, valuePairs, loop) {
        var wrapperList = [];
        var setter = function (value) {
            drawable[propertyKey] = value;
        };

        var start = drawable[propertyKey] || 0;
        for (var i = 0; i < valuePairs.length; i++) {
            var current = valuePairs[i];

            wrapperList.push({
                drawable: drawable,
                setter: setter,
                animation: Animations.get(start, current.value, current.duration, current.easing, false),
                callback: current.callback
            });

            start = current.value;
        }

        this.animationHelper.animateWithKeyFrames(wrapperList, loop);
    };

    return PropertyAnimations;
})(H5.Animations);