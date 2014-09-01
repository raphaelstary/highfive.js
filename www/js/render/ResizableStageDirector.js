var ResizableStageDirector = (function (changeCoords) {
    "use strict";

    function ResizableStageDirector(stage, textures, resizer) {
        this.stage = stage;
        this.textures = textures;
        this.resizer = resizer;
    }

    ResizableStageDirector.prototype.drawFresh = function (xFn, yFn, imgName, zIndex) {
        var drawable = this.stage.drawFresh(xFn(), yFn(), imgName, zIndex);
        this.resizer.add(drawable, function () {
            changeCoords(drawable, xFn(), yFn());
        });

        return drawable;
    };

    ResizableStageDirector.prototype.drawText = function (xFn, yFn, text, size, font, color, zIndex) {
        var drawable = this.stage.getDrawableText(xFn(), yFn(), zIndex, text, size, font, color);
        this.stage.draw(drawable);
        this.resizer.add(drawable, function () {
            changeCoords(drawable, xFn(), yFn());
        });

        return drawable;
    };

    ResizableStageDirector.prototype.resize = function (width, height) {
        this.stage.resize(width, height);
        this.textures.resize(width, height);
        this.resizer.call();
    };

    ResizableStageDirector.prototype.getDrawable = function (x, y, imgPathName, zIndex) {
        return undefined; //todo implement
    };

    ResizableStageDirector.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength, lineHeight) {
        return undefined; //todo implement
    };

    ResizableStageDirector.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return undefined; //todo implement
    };

    ResizableStageDirector.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return undefined; //todo implement
    };

    ResizableStageDirector.prototype.getSubImage = function (imgPathName) {
        return this.textures.get(imgPathName);
    };

    ResizableStageDirector.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames) {
        //todo implement
    };

    ResizableStageDirector.prototype.animate = function (drawable, sprite, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.animateLater = function (drawableToAdd, duration, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.move = function (drawable, path, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.moveLater = function (drawableToAdd, duration, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.draw = function (drawable) {
        this.stage.draw(drawable);
    };

    ResizableStageDirector.prototype.remove = function (drawable) {
        this.stage.remove(drawable);
    };

    ResizableStageDirector.prototype.has = function (drawable) {
        return this.stage(drawable);
    };

    ResizableStageDirector.prototype.tick = function () {
        this.stage.tick();
    };

    return ResizableStageDirector;
})(changeCoords);