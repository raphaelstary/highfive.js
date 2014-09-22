var AnimationDirector = (function () {
    "use strict";

    // high level animation methods
    function AnimationDirector(animationStudio) {
        this.animationStudio = animationStudio;
        this.todos = [];
    }

    AnimationDirector.prototype.update = function () {

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {
                this.animate(toAdd.addable.drawable, toAdd.addable.setter, toAdd.addable.animation, toAdd.addable.callback);

                if (toAdd.callback) {
                    toAdd.callback();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }

        this.animationStudio.update();
    };

    AnimationDirector.prototype.animate = function (drawable, setter, animation, callback) {
        this.animationStudio.animate(drawable, setter, animation, callback);
    };

    AnimationDirector.prototype.animateWithKeyFrames = function (drawableWrapperList, loop) {
        if (loop) {
            var copy = drawableWrapperList.slice();
        }
        var self = this;

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
            self.animationStudio.animate(wrapper.drawable, wrapper.setter, wrapper.animation, callback);
        }
    };

    AnimationDirector.prototype.animateLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            callback: callback
        });
    };

    AnimationDirector.prototype.remove = function (drawable) {
        this.animationStudio.remove(drawable);
    };

    AnimationDirector.prototype.has = function (drawable) {
        return this.animationStudio.has(drawable);
    };

    return AnimationDirector;
})();