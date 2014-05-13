var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio() {
        this.animationsDict = {};
    }

    AnimationStudio.prototype.animate = function (animatedItem, sprite, callback) {
        animatedItem.img = sprite.frames[0];
        sprite.current = 0;

        this.animationsDict[animatedItem.id] = {
            item: animatedItem,
            sprite: sprite,
            ready: callback
        };
    };

    AnimationStudio.prototype.remove = function (animatedItem) {
        delete this.animationsDict[animatedItem.id];
    };

    AnimationStudio.prototype.nextFrame = function () {
        for (var key in this.animationsDict) {
            if (this.animationsDict.hasOwnProperty(key)) {
                var item = this.animationsDict[key].item;
                var sprite = this.animationsDict[key].sprite;

                item.img = sprite.frames[++sprite.current];
                if (sprite.current >= sprite.frames.length) {
                    if (this.animationsDict[key].ready !== undefined) {
                        this.animationsDict[key].ready();
                    }
                    if (sprite.loop) {
                        sprite.current = 0;
                        item.img = sprite.frames[0];
                    } else {
                        delete this.animationsDict[key];
                    }
                }
            }
        }
    };

    return AnimationStudio;
})();