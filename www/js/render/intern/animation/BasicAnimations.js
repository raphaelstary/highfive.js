var BasicAnimations = (function (Object) {
    "use strict";

    function BasicAnimations() {
        this.dict = {};
    }

    BasicAnimations.prototype.animate = function (drawable, setter, animation, callback) {
        this.dict[drawable.id] = {
            drawable: drawable,
            setter: setter,
            animation: animation,
            ready: callback,
            time: 0
        };
    };

    BasicAnimations.prototype.update = function () {
        Object.keys(this.dict).forEach(function (key) {
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
        }, this);
    };

    BasicAnimations.prototype.remove = function (drawable) {
        delete this.dict[drawable.id];
    };

    BasicAnimations.prototype.has = function (drawable) {
        return this.dict[drawable.id] !== undefined;
    };

    return BasicAnimations;
})(Object);