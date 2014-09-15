var MotionDirector = (function () {
    "use strict";

    // high level move methods
    function MotionDirector(motionStudio) {
        this.motionStudio = motionStudio;
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

        this.motionStudio.update();
    };

    MotionDirector.prototype.move = function (drawable, path, callback) {
        this.motionStudio.move(drawable, path, callback);
    };

    MotionDirector.prototype.moveLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    MotionDirector.prototype.pause = function (drawable) {
        this.motionStudio.pause(drawable);
    };

    MotionDirector.prototype.play = function (drawable) {
        this.motionStudio.play(drawable);
    };

    MotionDirector.prototype.remove = function (drawable) {
        this.motionStudio.remove(drawable);
    };

    MotionDirector.prototype.has = function (drawable) {
        return this.motionStudio.has(drawable);
    };

    return MotionDirector;
})();