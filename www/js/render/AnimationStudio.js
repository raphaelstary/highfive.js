var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio() {
        this.animationsDict = {};
    }

    AnimationStudio.prototype.animate = function (animatedItem, sprite, callback) {
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

    AnimationStudio.prototype.nextSprite = function (item, sprite) {
        this.animationsDict[item.id].sprite = sprite;
        item.img = sprite.frames[0];
    };

    AnimationStudio.prototype.changeToStatic = function (item, img) {
        item.img = img;
        this.remove(item);
    };

    return AnimationStudio;
})();