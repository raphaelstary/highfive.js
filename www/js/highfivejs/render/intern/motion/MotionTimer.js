H5.MotionTimer = (function () {
    'use strict';

    function MotionTimer(motions, timer) {
        this.motions = motions;
        this.timer = timer;
    }

    MotionTimer.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.motions.animate(drawableToAdd.drawable, drawableToAdd.path, drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return MotionTimer;
})();