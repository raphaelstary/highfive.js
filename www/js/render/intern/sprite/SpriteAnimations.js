var SpriteAnimations = (function (Object) {
    "use strict";

    function SpriteAnimations() {
        this.animationsDict = {};
        this.ticker = 0;
    }

    SpriteAnimations.prototype.animate = function (drawable, sprite, callback) {
        drawable.data = sprite.frames[0];

        this.animationsDict[drawable.id] = {
            item: drawable,
            sprite: sprite,
            ready: callback,
            time: 0
        };
    };

    SpriteAnimations.prototype.remove = function (drawable) {
        delete this.animationsDict[drawable.id];
    };

    SpriteAnimations.prototype.has = function (drawable) {
        return this.animationsDict[drawable.id] !== undefined;
    };

    SpriteAnimations.prototype.nextFrame = function () {
        Object.keys(this.animationsDict).forEach(function (key) {
            var animation = this.animationsDict[key];
            var item = animation.item;
            var sprite = animation.sprite;

            item.data = sprite.frames[++animation.time];
            if (animation.time >= sprite.frames.length) {
                if (this.animationsDict[key].ready !== undefined) {
                    this.animationsDict[key].ready();
                }
                if (sprite.loop) {
                    animation.time = 0;
                    item.data = sprite.frames[0];
                } else {
                    delete this.animationsDict[key];
                }
            }
        }, this);
    };

    SpriteAnimations.prototype.update = function () {
        if (this.ticker % 2 === 0) {
            this.nextFrame();
            this.ticker = 0;
        }
        this.ticker++;
    };

    return SpriteAnimations;
})(Object);