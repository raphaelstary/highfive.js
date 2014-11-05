var SpriteAnimations = (function (Object) {
    "use strict";

    function SpriteAnimations() {
        this.animationsDict = {};
        this.ticker = 0;
    }

    SpriteAnimations.prototype.animate = function (drawable, sprite, callback) {
        drawable.data = sprite.frames[0];

        this.animationsDict[drawable.id] = {
            drawable: drawable,
            sprite: sprite,
            callback: callback,
            time: 0
        };
    };

    SpriteAnimations.prototype.nextFrame = function () {
        Object.keys(this.animationsDict).forEach(function (key) {
            var animation = this.animationsDict[key];
            var drawable = animation.drawable;
            var sprite = animation.sprite;

            drawable.data = sprite.frames[++animation.time];
            if (animation.time >= sprite.frames.length) {

                if (sprite.loop) {
                    animation.time = 0;
                    drawable.data = sprite.frames[0];
                } else {
                    delete this.animationsDict[key];
                }

                if (animation.callback) {
                    animation.callback();
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

    SpriteAnimations.prototype.remove = function (drawable) {
        delete this.animationsDict[drawable.id];
    };

    SpriteAnimations.prototype.has = function (drawable) {
        return this.animationsDict[drawable.id] !== undefined;
    };

    return SpriteAnimations;
})(Object);