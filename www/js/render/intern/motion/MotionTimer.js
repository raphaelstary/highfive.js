var MotionTimer = (function () {
    "use strict";

    // high level move methods
    function MotionTimer(motions) {
        this.motions = motions;
        this.todos = [];
    }

    MotionTimer.prototype.update = function () {

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {
                this.motions.move(toAdd.addable.item, toAdd.addable.path, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    MotionTimer.prototype.moveLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    return MotionTimer;
})();