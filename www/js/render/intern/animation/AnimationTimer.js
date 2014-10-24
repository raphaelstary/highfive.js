var AnimationTimer = (function () {
    "use strict";

    // high level animation methods
    function AnimationTimer(animations) {
        this.animations = animations;
        this.todos = [];
    }

    AnimationTimer.prototype.update = function () {

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {
                this.animations.animate(toAdd.addable.drawable, toAdd.addable.setter, toAdd.addable.animation,
                    toAdd.addable.callback);

                if (toAdd.callback) {
                    toAdd.callback();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    AnimationTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            callback: callback
        });
    };

    return AnimationTimer;
})();