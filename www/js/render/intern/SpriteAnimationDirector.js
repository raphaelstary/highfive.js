var SpriteAnimationDirector = (function () {
    "use strict";

    function SpriteAnimationDirector(spriteAnimationStudio) {
        this.spriteAnimationStudio = spriteAnimationStudio;
        this.todos = [];
        this.ticker = 0;
    }

    SpriteAnimationDirector.prototype.update = function () {
        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {

                this.spriteAnimationStudio.animate(toAdd.addable.item, toAdd.addable.sprite, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }

        if (this.ticker % 2 === 0) {
            this.spriteAnimationStudio.nextFrame();
            this.ticker = 0;
        }
        this.ticker++;
    };

    SpriteAnimationDirector.prototype.animateLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    SpriteAnimationDirector.prototype.animate = function (drawable, sprite, callback) {
        this.spriteAnimationStudio.animate(drawable, sprite, callback);
    };

    SpriteAnimationDirector.prototype.remove = function (drawable) {
        this.spriteAnimationStudio.remove(drawable);
    };

    SpriteAnimationDirector.prototype.has = function (drawable) {
        return this.spriteAnimationStudio.has(drawable);
    };

    return SpriteAnimationDirector;
})();