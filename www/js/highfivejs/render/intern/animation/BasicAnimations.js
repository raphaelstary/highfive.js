H5.BasicAnimations = (function (Object, iterateEntries) {
    "use strict";

    function BasicAnimations() {
        this.dict = {};
        this.paused = {};
    }

    BasicAnimations.prototype.animate = function (drawable, setter, animation, callback) {
        var hasEntry = this.dict[drawable.id] !== undefined;
        var isPaused = this.paused[drawable.id] !== undefined;

        if (hasEntry) {
            this.dict[drawable.id].push({
                setter: setter,
                animation: animation,
                callback: callback,
                time: 0,
                active: true
            });

        } else if (isPaused) {
            this.paused[drawable.id].push({
                setter: setter,
                animation: animation,
                callback: callback,
                time: 0,
                active: true
            });

        } else {
            this.dict[drawable.id] = [
                {
                    setter: setter,
                    animation: animation,
                    callback: callback,
                    time: 0,
                    active: true
                }
            ];
        }
    };

    BasicAnimations.prototype.update = function () {
        Object.keys(this.dict).forEach(function (key) {
            var list = this.dict[key];
            if (!list)
                return; // ie11 has null references after removing todo maybe change to pendingDeletes list?

            for (var i = list.length - 1; i >= 0; i--) {
                var wrapper = list[i];
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
                        list.splice(i, 1);
                    }

                    if (wrapper.callback) {
                        wrapper.callback();
                    }
                }
            }

            if (list.length == 0) {
                delete this.dict[key];
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
})(Object, H5.iterateEntries);