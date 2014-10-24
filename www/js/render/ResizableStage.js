var ResizableStage = (function (changeCoords, changePath, PxCollisionDetector, inheritMethods, TextWrapper) {
    "use strict";

    function ResizableStage(stage, gfx, resizer, createInput, changeInput, width, height, timer) {
        this.stage = stage;
        this.gfx = gfx;
        this.resizer = resizer;
        this.createInput = createInput;
        this.changeInput = changeInput; //maybe push to global class dependency injection (see line 1)

        this.width = width;
        this.height = height;

        this.timer = timer;

        this.collisions = {};

        inheritMethods(stage, this, ResizableStage.prototype);
    }

    ResizableStage.prototype.getCollisionDetector = function (drawable) {
        var collisions = new PxCollisionDetector(drawable);
        this.collisions[drawable.id] = collisions;

        return collisions;
    };

    ResizableStage.prototype.detachCollisionDetector = function (collisionDetector) {
        delete this.collisions[collisionDetector.drawable.id];
    };

    ResizableStage.prototype.drawFresh = function (xFn, yFn, imgName, zIndex, resizeIsDependentOnThisDrawables, alpha,
        rotation, scale) {
        var drawable = this.stage.drawFresh(xFn(this.width), yFn(this.height), imgName, zIndex, alpha, rotation, scale);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStage.prototype.drawFreshWithInput = function (xFn, yFn, imgName, zIndex, resizeIsDependentOnThisDrawables,
        alpha, rotation, scale) {
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

    ResizableStage.prototype.drawText = function (xFn, yFn, text, sizeFn, font, color, zIndex,
        resizeIsDependentOnThisDrawables, rotation, alpha, maxLineLength, lineHeight) {
        var drawable = this.stage.drawText(xFn(this.width), yFn(this.height), text, sizeFn(this.width, this.height),
            font, color, zIndex, rotation, alpha, maxLineLength, lineHeight);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            drawable.data.size = sizeFn(width, height);
        }, resizeIsDependentOnThisDrawables);

        return drawable;
    };

    ResizableStage.prototype.drawTextWithInput = function (xFn, yFn, text, sizeFn, font, color, zIndex,
        resizeIsDependentOnThisDrawables, alpha, rotation, maxLineLength, lineHeight) {
        var drawable = this.stage.getDrawableText(xFn(this.width), yFn(this.height), zIndex, text,
            sizeFn(this.width, this.height), font, color, rotation, alpha, maxLineLength, lineHeight);
        this.stage.draw(drawable);
        var input = this.createInput(drawable);
        var self = this;
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width), yFn(height));
            drawable.data.size = sizeFn(width, height);
            self.changeInput(input, drawable);
        }, resizeIsDependentOnThisDrawables);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStage.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;

        this.stage.resize(width, height);
        if (this.gfx.resize)
            this.gfx.resize(width, height);
        this.resizer.call(width, height);

        for (var key in this.collisions) {
            this.collisions[key].resize();
        }
    };

    ResizableStage.prototype.animateFresh = function (xFn, yFn, imgPathName, numberOfFrames, loop,
        resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {

        var wrapper = this.stage.animateFresh(xFn(this.width), yFn(this.height), imgPathName, numberOfFrames, loop,
            zIndex, alpha, rotation, scale);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width), yFn(height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;
    };

    ResizableStage.prototype.moveFresh = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing, loop, callback,
        resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width), endYFn(height));
            }, resizeIsDependentOnThisDrawables);
        };

        var enhancedCallBack;
        if (callback) {
            if (loop)
                enhancedCallBack = callback; else {
                enhancedCallBack = function () {
                    callback();
                    registerResizeAfterMove();
                }
            }
        } else {
            if (loop)
                enhancedCallBack = undefined; else
                enhancedCallBack = registerResizeAfterMove;
        }

        var wrapper = this.stage.moveFresh(xFn(this.width), yFn(this.height), imgName, endXFn(this.width),
            endYFn(this.height), speed, spacing, loop, enhancedCallBack, zIndex, alpha, rotation, scale);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width), yFn(height));
            changePath(wrapper.path, xFn(width), yFn(height), endXFn(width), endYFn(height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;
    };

    ResizableStage.prototype.moveFreshText = function (xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed,
        spacing, loop, callback, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, maxLineLength, lineHeight) {

        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width), endYFn(height));
                wrapper.drawable.data.size = sizeFn(width, height);
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
            wrapper.drawable.data.size = sizeFn(width, height);
            changePath(wrapper.path, xFn(width), yFn(height), endXFn(width), endYFn(height));
        }, resizeIsDependentOnThisDrawables);

        return wrapper;

    };

    ResizableStage.prototype.moveFreshRoundTrip = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing,
        loopTheTrip, callbackTo, callbackReturn, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
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

    ResizableStage.prototype.moveFreshLater = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing, delay, loop,
        callback, startedMovingCallback, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
        var returnObject = {};
        var self = this;
        this.timer.doLater(function () {
            if (startedMovingCallback) {
                startedMovingCallback();
            }
            var wrapper = self.moveFresh(xFn, yFn, imgName, endXFn, endYFn, speed, spacing, loop, callback,
                resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale);

            for (var key in wrapper) {
                if (wrapper.hasOwnProperty(key)) {
                    returnObject[key] = wrapper[key];
                }
            }
        }, delay);
        return returnObject;
    };

    ResizableStage.prototype.moveFreshTextLater = function (xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed,
        spacing, delay, loop, callback, startedMovingCallback, resizeIsDependentOnThisDrawables, zIndex, alpha,
        rotation, maxLineLength, lineHeight) {
        var returnObject = {};
        var self = this;
        this.timer.doLater(function () {
            var wrapper = self.moveFreshText(xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed, spacing, loop,
                callback, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, maxLineLength, lineHeight);

            for (var key in wrapper) {
                if (wrapper.hasOwnProperty(key)) {
                    returnObject[key] = wrapper[key];
                }
            }
            if (startedMovingCallback) {
                startedMovingCallback();
            }
        }, delay);
        return returnObject;
    };

    ResizableStage.prototype.move = function (drawable, endXFn, endYFn, speed, spacing, loop, callback,
        resizeIsDependentOnThisDrawables) {
        var pathId = {id: drawable.id + '_1'};
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.remove(pathId);

            if (drawable.data instanceof TextWrapper) {
                var afterFontSize_id = {id: drawable.id + '_2'};
                self.resizer.add(afterFontSize_id, function (width, height) {
                    changeCoords(drawable, endXFn(width), endYFn(height));
                }, resizeIsDependentOnThisDrawables);
            } else {
                resizeIsDependentOnThisDrawables = resizeIsDependentOnThisDrawables.filter(function (element) {
                    return element.id != drawable.id;
                });
                self.resizer.add(drawable, function (width, height) {
                    changeCoords(drawable, endXFn(width), endYFn(height));
                }, resizeIsDependentOnThisDrawables);
            }
        };

        var enhancedCallBack;
        if (callback) {
            enhancedCallBack = function () {
                registerResizeAfterMove();
                callback();
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

    ResizableStage.prototype.moveRoundTrip = function (drawable, endXFn, endYFn, speed, spacing, loopTheTrip,
        callbackTo, callbackReturn, resizeIsDependentOnThisDrawables, zIndex, alpha, rotation, scale) {
        //todo implement
    };

    ResizableStage.prototype.moveLater = function (drawable, endXFn, endYFn, speed, spacing, loop, callback,
        resizeIsDependentOnThisDrawables, duration, laterCallback) {
        var self = this;
        this.timer.doLater(function () {
            if (laterCallback) {
                laterCallback();
            }
            self.move(drawable, endXFn, endYFn, speed, spacing, loop, callback, resizeIsDependentOnThisDrawables);

        }, duration);
    };

    ResizableStage.prototype.remove = function (drawable) {
        this.resizer.remove(drawable);
        var idOfPossiblePath = {
            id: drawable.id + '_1'
        };
        this.resizer.remove(idOfPossiblePath);
        var idOfPossibleTxtSizeAfterPath = {
            id: drawable.id + '_2'
        };
        this.resizer.remove(idOfPossibleTxtSizeAfterPath);
        this.stage.remove(drawable);
    };

    ResizableStage.prototype.show = function (drawable) {
        this.stage.draw(drawable);
    };

    ResizableStage.prototype.hide = function (drawable) {
        this.stage.remove(drawable);
    };

    ResizableStage.prototype.has = function (drawable) {
        return this.resizer.has(drawable) || this.stage.has(drawable);
    };

    ResizableStage.prototype.update = function () {
        this.stage.update();
        this.timer.update();
    };

    return ResizableStage;
})(changeCoords, changePath, CanvasImageCollisionDetector, inheritMethods, TextWrapper);
