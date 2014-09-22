var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio() {
        this.dict = {};
    }

    AnimationStudio.prototype.animate = function (drawable, setter, animation, callback) {
        this.dict[drawable.id] = {
            drawable: drawable,
            setter: setter,
            animation: animation,
            ready: callback,
            time: 0
        };
    };

    AnimationStudio.prototype.update = function () {
        for (var key in this.dict) {
            if (!this.dict.hasOwnProperty(key)) {
                continue;
            }

            var wrapper = this.dict[key];

            var animation = wrapper.animation;
            if (animation.duration > wrapper.time) {

                wrapper.setter(animation.timingFn(wrapper.time, animation.start, animation.length, animation.duration));
                wrapper.time++;

            } else {
                wrapper.setter(animation.end);

                if (animation.loop) {
                    wrapper.time = 0;
                } else {
                    delete this.dict[key];
                }

                if (wrapper.ready) {
                    wrapper.ready();
                }
            }
        }
    };

    AnimationStudio.prototype.remove = function (drawable) {
        delete this.dict[drawable.id];
    };

    AnimationStudio.prototype.has = function (drawable) {
        return this.dict[drawable.id] !== undefined;
    };

    return AnimationStudio;
})();