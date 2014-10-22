var BasicAnimationHelper = (function () {
    "use strict";

    // high level animation methods
    function BasicAnimationHelper(animations) {
        this.animations = animations;
    }

    BasicAnimationHelper.prototype.animateWithKeyFrames = function (drawableWrapperList, loop) {
        if (loop) {
            var copy = drawableWrapperList.slice();
        }
        var self = this;

        keyFrame(drawableWrapperList.shift(), drawableWrapperList);

        function keyFrame(wrapper, nextKeyFrameSlices) {
            var callback;
            if (nextKeyFrameSlices.length > 0) {
                if (wrapper.callback) {
                    callback = function () {
                        wrapper.callback();
                        keyFrame(nextKeyFrameSlices.shift(), nextKeyFrameSlices);
                    };
                } else {
                    callback = function () {
                        keyFrame(nextKeyFrameSlices.shift(), nextKeyFrameSlices);
                    };
                }
            } else if (loop) {
                callback = function () {
                    self.animateWithKeyFrames(copy, loop);
                };
            }
            self.animations.animate(wrapper.drawable, wrapper.setter, wrapper.animation, callback);
        }
    };

    return BasicAnimationHelper;
})();