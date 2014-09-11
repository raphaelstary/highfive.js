var ResizableStageDirector = (function (changeCoords, changePath) {
    "use strict";

    function ResizableStageDirector(stage, textures, resizer, createInput, changeInput, width, height) {
        this.stage = stage;
        this.textures = textures;
        this.resizer = resizer;
        this.createInput = createInput;
        this.changeInput = changeInput; //maybe push to global class dependency injection (see line 1)

        this.width = width;
        this.height = height;
    }

    ResizableStageDirector.prototype.drawFresh = function (xFn, yFn, imgName, zIndex, resizeIsDependentOnThisDrawables) {
        var drawable = this.stage.drawFresh(xFn(this.width), yFn(this.height), imgName, zIndex);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStageDirector.prototype.drawFreshWithInput = function (xFn, yFn, imgName, zIndex, resizeIsDependentOnThisDrawables) {
        var drawable = this.stage.drawFresh(xFn(this.width), yFn(this.height), imgName, zIndex);
        var self = this;
        var input = self.createInput(drawable);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            self.changeInput(input, drawable);
        }, resizeIsDependentOnThisDrawables);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStageDirector.prototype.drawText = function (xFn, yFn, text, sizeFn, font, color, zIndex, resizeIsDependentOnThisDrawables) {
        var drawable = this.stage.getDrawableText(xFn(this.width), yFn(this.height), zIndex, text,
            sizeFn(this.width, this.height), font, color);
        this.stage.draw(drawable);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            drawable.txt.size = sizeFn(width, height);
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStageDirector.prototype.drawTextWithInput = function (xFn, yFn, text, sizeFn, font, color, zIndex, resizeIsDependentOnThisDrawables) {
        var drawable = this.stage.getDrawableText(xFn(this.width), yFn(this.height), zIndex, text,
            sizeFn(this.width, this.height), font, color);
        this.stage.draw(drawable);
        var input = this.createInput(drawable);
        var self = this;
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            drawable.txt.size = sizeFn(width, height);
            self.changeInput(input, drawable);
        }, resizeIsDependentOnThisDrawables);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStageDirector.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;

        this.stage.resize(width, height);
        this.textures.resize(width, height);
        this.resizer.call(width, height);
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

    ResizableStageDirector.prototype.moveFresh = function (xFn, yFn, imgName, endXFn, endYFn, speedFn, spacing, loop, callback, resizeIsDependentOnThisDrawables) {
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width), endYFn(height));
            }, resizeIsDependentOnThisDrawables);
        };

        var enhancedCallBack;
        if (callback) {
            enhancedCallBack = function () {
                callback();
                registerResizeAfterMove();
            }
        } else {
            enhancedCallBack = registerResizeAfterMove;
        }

        var wrapper = this.stage.moveFresh(xFn(this.width), yFn(this.height), imgName, endXFn(this.width), endYFn(this.height),
            speedFn(this.width, this.height), spacing, loop, enhancedCallBack);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width), yFn(height));
            changePath(wrapper.path, xFn(width), yFn(height), endXFn(width), endYFn(height), speedFn(width, height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;
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
        this.resizer.remove(drawable);
        this.stage.remove(drawable);
    };

    ResizableStageDirector.prototype.has = function (drawable) {
        return this.stage(drawable);
    };

    ResizableStageDirector.prototype.tick = function () {
        this.stage.tick();
    };

    return ResizableStageDirector;
})(changeCoords, changePath);