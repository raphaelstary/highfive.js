var AnimationStudioManager = (function () {
    "use strict";

    function AnimationStudioManager(animationStudio) {
        this.animationStudio = animationStudio;
        this.todos = [];
        this.ticker = 0;
    }

    AnimationStudioManager.prototype.update = function () {
        if (this.ticker % 2 === 0) {
            this.animationStudio.nextFrame();
            this.ticker = 0;
        }
        this.ticker++;

        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {

                this.animationStudio.animate(toAdd.addable.item, toAdd.addable.sprite, toAdd.addable.ready);

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