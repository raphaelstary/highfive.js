var CallbackTimer = (function () {
    "use strict";

    // high level move methods
    function CallbackTimer() {
        this.todos = [];
    }

    CallbackTimer.prototype.update = function () {

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {
                toAdd.callback();

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    CallbackTimer.prototype.doLater = function (callback, duration) {
        this.todos.push({
            duration: duration,
            time: 0,
            callback: callback
        });
    };

    return CallbackTimer;
})();