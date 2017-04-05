H5.AnimationTimer = (function () {
    'use strict';

    function AnimationTimer(animations, timer) {
        this.animations = animations;
        this.timer = timer;
    }

    AnimationTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.animations.animate(drawableToAdd.drawable, drawableToAdd.setter, drawableToAdd.animation,
                drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return AnimationTimer;
})();