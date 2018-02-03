H5.SpriteTimer = (function () {
    'use strict';

    function SpriteTimer(spriteAnimations, timer) {
        this.spriteAnimations = spriteAnimations;
        this.timer = timer;
    }

    SpriteTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.spriteAnimations.animate(drawableToAdd.drawable, drawableToAdd.sprite, drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return SpriteTimer;
})();
