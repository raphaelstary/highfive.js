var AnimationAssistant = (function (Animations) {
    "use strict";

    function AnimationAssistant(animationDirector) {
        this.animationDirector = animationDirector;
    }

    AnimationAssistant.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        this.animateProperty(drawable, 'alpha', value, duration, easing, loop, callback);
    };

    AnimationAssistant.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.animatePropertyPattern(drawable, 'alpha', valuePairs, loop);
    };

    AnimationAssistant.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        this.animateProperty(drawable, 'rotation', value, duration, easing, loop, callback);
    };

    AnimationAssistant.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.animatePropertyPattern(drawable, 'rotation', valuePairs, loop);
    };

    AnimationAssistant.prototype.animateProperty = function (drawable, propertyKey, value, duration, easing, loop, callback) {
        var animation = Animations.get(drawable[propertyKey], value, duration, easing, loop);

        this.animationDirector.animate(drawable, function (value) {
            drawable[propertyKey] = value;
        }, animation, callback);
    };

    AnimationAssistant.prototype.animatePropertyPattern = function (drawable, propertyKey, valuePairs, loop) {
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

    return AnimationAssistant;
})(Animations);