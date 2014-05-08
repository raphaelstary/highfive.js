var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio(renderer) {
        this.renderer = renderer;
        this.animationsDict = {};
    }

    AnimationStudio.prototype.add = function (animatedItem) {
        this.animationsDict[animatedItem.id] = animatedItem;

        this.renderer.add(animatedItem);
    };

    AnimationStudio.prototype.remove = function (animatedItem) {
        delete this.animationsDict[animatedItem.id];
    };

    AnimationStudio.prototype.nextFrame = function () {
        for (var key in this.animationsDict) {
            if (this.animationsDict.hasOwnProperty(key)) {
                var elem = this.animationsDict[key];
                if (elem.sprite === undefined) {
                    continue;
                }

                elem.img = elem.sprite.frames[++elem.sprite.current];
                if (elem.sprite.current >= elem.sprite.frames.length) {
                    elem.sprite.current = 0;
                    elem.img = elem.sprite.frames[0];
                }
            }
        }
    };

    AnimationStudio.prototype.nextSprite = function (item, sprite) {
        item.sprite = sprite;
        item.img = sprite.frames[0];
    };

    AnimationStudio.prototype.changeToStatic = function (item, img) {
        item.img = img;
        delete item.sprite;
    };

    return AnimationStudio;
})();