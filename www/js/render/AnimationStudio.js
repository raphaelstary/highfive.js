var AnimationStudio = (function () {
    "use strict";

    function AnimationStudio(renderer) {
        this.renderer = renderer;
        this.animationsDict = {};
    }

    AnimationStudio.prototype.add = function (animatedItem, callback) {
        this.animationsDict[animatedItem.id] = {
            item: animatedItem,
            ready: callback
        };

        this.renderer.add(animatedItem);
    };

    AnimationStudio.prototype.remove = function (animatedItem) {
        delete this.animationsDict[animatedItem.id];
    };

    AnimationStudio.prototype.nextFrame = function () {
        for (var key in this.animationsDict) {
            if (this.animationsDict.hasOwnProperty(key)) {
                var elem = this.animationsDict[key].item;
                if (elem.sprite === undefined) {
                    continue;
                }

                elem.img = elem.sprite.frames[++elem.sprite.current];
                if (elem.sprite.current >= elem.sprite.frames.length) {
                    if (this.animationsDict[key].ready !== undefined) {
                        this.animationsDict[key].ready();
                    }
                    if (elem.sprite.loop) {
                        elem.sprite.current = 0;
                        elem.img = elem.sprite.frames[0];
                    } else {
                        delete this.animationsDict[key];
                    }
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