var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio() {
        this.animationsDict = {};
    }

    AnimationStudio.prototype.animate = function (animatedItem, sprite, callback) {
        animatedItem.img = sprite.frames[0];

        this.animationsDict[animatedItem.id] = {
            item: animatedItem,
            sprite: sprite,
            ready: callback,
            time: 0
        };
    };

    AnimationStudio.prototype.remove = function (animatedItem) {
        delete this.animationsDict[animatedItem.id];
    };

    AnimationStudio.prototype.nextFrame = function () {
        for (var key in this.animationsDict) {
            if (this.animationsDict.hasOwnProperty(key)) {
                var animation = this.animationsDict[key];
                var item = animation.item;
                var sprite = animation.sprite;

                item.img = sprite.frames[++animation.time];
                if (animation.time >= sprite.frames.length) {
                    if (this.animationsDict[key].ready !== undefined) {
                        this.animationsDict[key].ready();
                    }
                    if (sprite.loop) {
                        animation.time = 0;
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