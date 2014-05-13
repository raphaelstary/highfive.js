var MotionDirector = (function () {
    "use strict";

    // high level move methods
    function MotionDirector(startMotions) {
        this.startMotions = startMotions;
        this.todos = [];
    }

    MotionDirector.prototype.update = function () {

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {
                this.move(toAdd.addable.item, toAdd.addable.path, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }

        this.startMotions.update();
    };

    MotionDirector.prototype.move = function (object, path, callback) {
        this.startMotions.move(object, path, callback);
    };

    MotionDirector.prototype.moveLater = function (itemToAdd, duration, callback) {
        this.todos.push({
            addable: itemToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    MotionDirector.prototype.remove = function (drawable) {
        this.startMotions.remove(drawable);
    };

    return MotionDirector;
})();