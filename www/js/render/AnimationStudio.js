var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio() {
        this.animationsDict = {};
    }

    AnimationStudio.prototype.animate = function (drawable, sprite, callback) {
        drawable.img = sprite.frames[0];

        this.animationsDict[drawable.id] = {
            item: drawable,
            sprite: sprite,
            ready: callback,
            time: 0
        };
    };

    AnimationStudio.prototype.remove = function (drawable) {
        delete this.animationsDict[drawable.id];
    };

    AnimationStudio.prototype.has = function (drawable) {
        return this.animationsDict[drawable.id] !== undefined;
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