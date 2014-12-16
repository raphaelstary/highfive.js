var BasicAnimations = (function (Object, iterateEntries) {
    "use strict";

    function BasicAnimations() {
        this.dict = {};
        this.paused = {};
    }

    BasicAnimations.prototype.animate = function (drawable, setter, animation, callback) {
        this.dict[drawable.id] = {
            setter: setter,
            animation: animation,
            callback: callback,
            time: 0,
            active: true
        };
    };

    BasicAnimations.prototype.update = function () {
        Object.keys(this.dict).forEach(function (key) {
            var wrapper = this.dict[key];

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

                if (wrapper.callback) {
                    wrapper.callback();
                }
            }
        }, this);
    };

    BasicAnimations.prototype.remove = function (drawable) {
        delete this.dict[drawable.id];
        delete this.paused[drawable.id];
    };

    BasicAnimations.prototype.has = function (drawable) {
        return this.dict[drawable.id] !== undefined || this.paused[drawable.id] !== undefined;
    };

    BasicAnimations.prototype.pause = function (drawable) {
        this.paused[drawable.id] = this.dict[drawable.id];
        delete this.dict[drawable.id];
    };

    BasicAnimations.prototype.pauseAll = function () {
        iterateEntries(this.dict, function (wrapper, id) {
            this.paused[id] = wrapper;
            delete this.dict[id];
        }, this);
    };

    BasicAnimations.prototype.play = function (drawable) {
        this.dict[drawable.id] = this.paused[drawable.id];
        delete this.paused[drawable.id];
    };

    BasicAnimations.prototype.playAll = function () {
        iterateEntries(this.paused, function (wrapper, id) {
            this.dict[id] = wrapper;
            delete this.paused[id];
        }, this);
    };

    return BasicAnimations;
})(Object, iterateEntries);