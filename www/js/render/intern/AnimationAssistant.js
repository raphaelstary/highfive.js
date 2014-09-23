var AnimationAssistant = (function (Animations) {
    "use strict";

    function AnimationAssistant(animationDirector) {
        this.animationDirector = animationDirector;
    }

    AnimationAssistant.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        this.__animateProperty(drawable, 'alpha', value, duration, easing, loop, callback);
    };

    AnimationAssistant.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'alpha', valuePairs, loop);
    };

    AnimationAssistant.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        this.__animateProperty(drawable, 'rotation', value, duration, easing, loop, callback);
    };

    AnimationAssistant.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'rotation', valuePairs, loop);
    };

    AnimationAssistant.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        this.__animateProperty(drawable, 'scale', value, duration, easing, loop, callback);
    };

    AnimationAssistant.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'scale', valuePairs, loop);
    };

    AnimationAssistant.prototype.__animateProperty = function (drawable, propertyKey, value, duration, easing, loop, callback) {
        var animation = Animations.get(drawable[propertyKey], value, duration, easing, loop);

        this.animationDirector.animate(drawable, function (value) {
            drawable[propertyKey] = value;
        }, animation, callback);
    };

    AnimationAssistant.prototype.__animatePropertyPattern = function (drawable, propertyKey, valuePairs, loop) {
        var wrapperList = [];
        var setter = function (value) {
            drawable[propertyKey] = value;
        };

        var start = drawable[propertyKey];
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

        this.animationDirector.animateWithKeyFrames(wrapperList, loop);
    };

    AnimationAssistant.prototype.animate = function (drawable, setter, animation, callback) {
        this.animationDirector.animate(drawable, setter, animation, callback);
    };

    AnimationAssistant.prototype.animateWithKeyFrames = function (drawableWrapperList, loop) {
        this.animationDirector.animateWithKeyFrames(drawableWrapperList, loop);
    };

    AnimationAssistant.prototype.animateLater = function (drawableToAdd, duration, callback) {
        this.animationDirector.animateLater(drawableToAdd, duration, callback);
    };

    AnimationAssistant.prototype.update = function () {
        this.animationDirector.update();
    };

    AnimationAssistant.prototype.remove = function (drawable) {
        this.animationDirector.remove(drawable);
    };

    AnimationAssistant.prototype.has = function (drawable) {
        return this.animationDirector.has(drawable);
    };

    return AnimationAssistant;
})(Animations);