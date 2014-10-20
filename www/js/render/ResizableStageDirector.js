var ResizableStageDirector = (function (changeCoords, changePath, PxCollisionDetector) {
    "use strict";

    function ResizableStageDirector(stage, textures, resizer, createInput, changeInput, width, height) {
        this.stage = stage;
        this.textures = textures;
        this.resizer = resizer;
        this.createInput = createInput;
        this.changeInput = changeInput; //maybe push to global class dependency injection (see line 1)

        this.width = width;
        this.height = height;

        this.collisions = {};
    }

    ResizableStageDirector.prototype.getCollisionDetector = function (drawable) {
        var collisions = new PxCollisionDetector(drawable);
        this.collisions[drawable.id] = collisions;

        return collisions;
    };

    ResizableStageDirector.prototype.detachCollisionDetector = function (collisionDetector) {
        delete this.collisions[collisionDetector.drawable.id];
    };

    ResizableStageDirector.prototype.drawFresh = function (xFn, yFn, imgName, zIndex, resizeIsDependentOnThisDrawables,
        alpha, rotation, scale) {
        var drawable = this.stage.drawFresh(xFn(this.width), yFn(this.height), imgName, zIndex, alpha, rotation, scale);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStageDirector.prototype.drawFreshWithInput = function (xFn, yFn, imgName, zIndex,
        resizeIsDependentOnThisDrawables, alpha, rotation, scale) {
        var drawable = this.stage.drawFresh(xFn(this.width), yFn(this.height), imgName, zIndex, alpha, rotation, scale);
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

    ResizableStageDirector.prototype.drawText = function (xFn, yFn, text, sizeFn, font, color, zIndex,
                                                          resizeIsDependentOnThisDrawables, rotation, alpha,
                                                          maxLineLength, lineHeight) {
        var drawable = this.stage.drawText(xFn(this.width), yFn(this.height), text, sizeFn(this.width, this.height),
            font, color, zIndex, rotation, alpha, maxLineLength, lineHeight);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            drawable.txt.size = sizeFn(width, height);
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStageDirector.prototype.drawTextWithInput = function (xFn, yFn, text, sizeFn, font, color, zIndex,
        resizeIsDependentOnThisDrawables, alpha, rotation, maxLineLength, lineHeight) {
        var drawable = this.stage.getDrawableText(xFn(this.width), yFn(this.height), zIndex, text,
            sizeFn(this.width, this.height), font, color, rotation, alpha, maxLineLength, lineHeight);
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

        for (var key in this.collisions) {
            this.collisions[key].resize();
        }
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

    ResizableStageDirector.prototype.moveFresh = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing, loop,
        callback, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
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
            speed, spacing, loop, enhancedCallBack, zIndex, alpha, rotation, scale);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width), yFn(height));
            changePath(wrapper.path, xFn(width), yFn(height), endXFn(width), endYFn(height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;
    };

    ResizableStageDirector.prototype.moveFreshText = function (xFn, yFn, text, sizeFn, font, color, endXFn, endYFn,
        speed, spacing, loop, callback, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, maxLineLength,
        lineHeight) {

        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width), endYFn(height));
                wrapper.drawable.txt.size = sizeFn(width, height);
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

        var wrapper = this.stage.moveFreshText(xFn(this.width), yFn(this.height), text, sizeFn(this.width, this.height),
            font, color, endXFn(this.width), endYFn(this.height), speed, spacing, loop, enhancedCallBack, zIndex, alpha,
            rotation, maxLineLength, lineHeight);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width), yFn(height));
            wrapper.drawable.txt.size = sizeFn(width, height);
            changePath(wrapper.path, xFn(width), yFn(height), endXFn(width), endYFn(height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;

    };

    ResizableStageDirector.prototype.moveFreshRoundTrip = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing,
                                                                    loopTheTrip, callbackTo, callbackReturn,
        resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
        var self = this;
        var registerResizeReturn = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width), endYFn(height));
                changePath(wrapper.pathTo, xFn(width), yFn(height), endXFn(width), endYFn(height));
                changePath(wrapper.pathReturn, endXFn(width), endYFn(height), xFn(width), yFn(height));
            }, resizeIsDependentOnThisDrawables);
        };

        var enhancedCallBackTo;
        if (callbackTo) {
            enhancedCallBackTo = function () {
                callbackTo();
                registerResizeReturn();
            }
        } else {
            enhancedCallBackTo = registerResizeReturn;
        }

        var initResize = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, xFn(width), yFn(height));
                changePath(wrapper.pathTo, xFn(width), yFn(height), endXFn(width), endYFn(height));
                changePath(wrapper.pathReturn, endXFn(width), endYFn(height), xFn(width), yFn(height));
            }, resizeIsDependentOnThisDrawables);
        };

        var registerResizeTo = function () {
            if (loopTheTrip) {
                initResize();
            } else {
                self.resizer.add(wrapper.drawable, function (width, height) {
                    changeCoords(wrapper.drawable, xFn(width), yFn(height));
                }, resizeIsDependentOnThisDrawables);
            }
        };

        var enhancedCallBackFrom;
        if (callbackTo) {
            enhancedCallBackFrom = function () {
                callbackTo();
                registerResizeTo();
            }
        } else {
            enhancedCallBackFrom = registerResizeTo;
        }

        var wrapper = this.stage.moveFreshRoundTrip(xFn(this.width), yFn(this.height), imgName, endXFn(this.width),
            endYFn(this.height), speed, spacing, loopTheTrip, enhancedCallBackTo, enhancedCallBackFrom, zIndex, alpha,
            rotation, scale);

        initResize();

        return wrapper;
    };

    ResizableStageDirector.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.move = function (drawable, endXFn, endYFn, speed, spacing, loop, callback,
        resizeIsDependentOnThisDrawables) {
        var pathId = {id: drawable.id + '_1'};
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.remove(pathId);
            self.resizer.add(drawable, function (width, height) {
                changeCoords(drawable, endXFn(width), endYFn(height));
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

        var path = this.stage.getPath(drawable.x, drawable.y, endXFn(this.width), endYFn(this.height), speed, spacing,
            loop);

        this.stage.move(drawable, path, enhancedCallBack);

        if (resizeIsDependentOnThisDrawables) {
            resizeIsDependentOnThisDrawables.push(drawable);
        } else {
            resizeIsDependentOnThisDrawables = [drawable];
        }

        this.resizer.add(pathId, function (width, height) {
            changePath(path, drawable.x, drawable.y, endXFn(width), endYFn(height));
        }, resizeIsDependentOnThisDrawables);
    };

    ResizableStageDirector.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo,
                                                               callbackReturn) {
        //todo implement
    };

    ResizableStageDirector.prototype.moveLater = function (drawableToAdd, duration, callback) {
        //todo implement
    };

    ResizableStageDirector.prototype.remove = function (drawable) {
        this.resizer.remove(drawable);
        this.stage.remove(drawable);
    };

    ResizableStageDirector.prototype.show = function (drawable) {
        this.stage.draw(drawable);
    };

    ResizableStageDirector.prototype.hide = function (drawable) {
        this.stage.remove(drawable);
    };

    ResizableStageDirector.prototype.has = function (drawable) {
        return this.resizer.has(drawable) || this.stage.has(drawable);
    };

    ResizableStageDirector.prototype.tick = function () {
        this.stage.tick();
    };

    ResizableStageDirector.prototype.pause = function (drawable) {
        this.stage.pause(drawable);
    };

    ResizableStageDirector.prototype.play = function (drawable) {
        this.stage.play(drawable);
    };

    return ResizableStageDirector;
})(changeCoords, changePath, CanvasImageCollisionDetector);