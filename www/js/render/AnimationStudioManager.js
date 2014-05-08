var AnimationStudioManager = (function () {
    "use strict";

    function AnimationStudioManager(animationStudio) {
        this.studio = animationStudio;
        this.todos = [];
        this.toNextSprites = [];
        this.changesToStatic = [];
    }

    AnimationStudioManager.prototype.update = function () {
        var toChange, i;

        for (i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {

                this.studio.add(toAdd.addable.item, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }

        for (i = this.toNextSprites.length - 1; i >= 0; i--) {
            toChange = this.toNextSprites[i];

            if (toChange.duration < toChange.time) {

                this.studio.nextSprite(toChange.item, toChange.sprite);

                if (toChange.ready) {
                    toChange.ready();
                }

                this.toNextSprites.splice(i, 1);

            } else {
                toChange.time++;
            }
        }

        for (i = this.changesToStatic.length - 1; i >= 0; i--) {
            toChange = this.changesToStatic[i];

            if (toChange.duration < toChange.time) {

                this.studio.changeToStatic(toChange.item, toChange.img);

                if (toChange.ready) {
                    toChange.ready();
                }

                this.changesToStatic.splice(i, 1);

            } else {
                toChange.time++;
            }
        }
    };

    AnimationStudioManager.prototype.throttleAdd = function (itemToAdd, duration, callback) {
        this.todos.push({
            addable: itemToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    AnimationStudioManager.prototype.throttleNextSprite = function (itemToChange, spriteToAdd, duration, callback) {
        this.toNextSprites.push({
            item: itemToChange,
            sprite: spriteToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    AnimationStudioManager.prototype.throttleChangeToStatic = function (itemToChange, imgToAdd, duration, callback) {
        this.changesToStatic.push({
            item: itemToChange,
            img: imgToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    return AnimationStudioManager;
})();