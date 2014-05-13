var AnimationDirector = (function () {
    "use strict";

    function AnimationDirector(animationStudio) {
        this.animationStudio = animationStudio;
        this.todos = [];
        this.ticker = 0;
    }

    AnimationDirector.prototype.update = function () {
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

        if (this.ticker % 2 === 0) {
            this.animationStudio.nextFrame();
            this.ticker = 0;
        }
        this.ticker++;
    };

    AnimationDirector.prototype.animateLater = function (itemToAdd, duration, callback) {
        this.todos.push({
            addable: itemToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    AnimationDirector.prototype.animate = function (animatedItem, sprite, callback) {
        this.animationStudio.animate(animatedItem, sprite, callback);
    };

    AnimationDirector.prototype.remove = function (animatedItem) {
        this.animationStudio.remove(animatedItem);
    };

    return AnimationDirector;
})();