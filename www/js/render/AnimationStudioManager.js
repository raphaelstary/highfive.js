var AnimationStudioManager = (function () {
    "use strict";

    function AnimationStudioManager(animationStudio) {
        this.studio = animationStudio;
        this.todos = [];
    }

    AnimationStudioManager.prototype.update = function () {
        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {

                this.studio.animate(toAdd.addable.item, toAdd.addable.sprite, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    AnimationStudioManager.prototype.throttleAnimate = function (itemToAdd, duration, callback) {
        this.todos.push({
            addable: itemToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    return AnimationStudioManager;
})();