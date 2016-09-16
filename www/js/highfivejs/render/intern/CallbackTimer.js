H5.CallbackTimer = (function () {
    "use strict";

    function CallbackTimer() {
        this.todos = [];
    }

    CallbackTimer.prototype.update = function () {
        if (this.todos.length == 0)
            return;
        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];
            if (!toAdd)
                continue;
            if (toAdd.duration < toAdd.time) {
                toAdd.callback();

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    CallbackTimer.prototype.doLater = function (callback, duration, self) {
        this.todos.push({
            duration: duration,
            time: 0,
            callback: self ? callback.bind(self) : callback
        });
    };

    CallbackTimer.prototype.pause = function () {
        if (this.paused) {
            this.paused.push.apply(this.paused, this.todos.splice(0, this.todos.length));
        } else {
            this.paused = this.todos.splice(0, this.todos.length);
        }
    };

    CallbackTimer.prototype.resume = function () {
        this.todos.push.apply(this.todos, this.paused);
        delete this.paused;
    };

    return CallbackTimer;
})();