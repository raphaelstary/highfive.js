var BasicAnimations = (function (Object) {
    "use strict";

    function BasicAnimations() {
        this.dict = {};
    }

    BasicAnimations.prototype.animate = function (drawable, setter, animation, callback) {
        this.dict[drawable.id] = {
            setter: setter,
            animation: animation,
            ready: callback,
            time: 0,
            active: true
        };
    };

    BasicAnimations.prototype.update = function () {
        Object.keys(this.dict).forEach(function (key) {
            var wrapper = this.dict[key];

            if (!wrapper.active)
                return;

            var animation = wrapper.animation;
            if (animation.duration > wrapper.time) {

                var value = animation.timingFn(wrapper.time, animation.start, animation.length, animation.duration);
                wrapper.setter(value, wrapper.time);
                wrapper.time++;

            } else {
                wrapper.setter(animation.end, wrapper.time);

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

    BasicAnimations.prototype.pause = function (drawable) {
        this.dict[drawable.id].active = false;
    };

    BasicAnimations.prototype.play = function (drawable) {
        this.dict[drawable.id].active = true;
    };

    return BasicAnimations;
})(Object);