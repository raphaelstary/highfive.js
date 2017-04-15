H5.AudioAnimations = (function (Animations, Math) {
    'use strict';

    function AudioAnimations(animations) {
        this.animations = animations;
    }

    AudioAnimations.prototype.animateVolume = function (audio, value, duration, easing, loop, callback) {
        return this.__animateProperty(audio, 'volume', value, duration, easing, loop, callback);
    };

    AudioAnimations.prototype.__animateProperty = function (audio, propertyKey, value, duration, easing, loop,
        callback) {
        var animation = Animations.get(audio[propertyKey], value, duration, easing, loop);

        this.animations.animate({id: audio.src}, function (value) {
            audio[propertyKey] = Math.floor(value * 100) / 100;
        }, animation, callback);

        return animation;
    };

    return AudioAnimations;
})(H5.Animations, Math);