H5.ResizableStage = (function (changeCoords, changePath, PxCollisionDetector, inheritMethods, TextWrapper,
    iterateEntries, Object, changeRectangle, changeMask, Rectangle, Vectors) {
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

    ResizableStage.prototype.drawFresh = function (xFn, yFn, imgName, zIndex, resizeDependencies, alpha, rotation,
        scale) {
        var drawable = this.stage.drawFresh(xFn(this.width, this.height), yFn(this.height, this.width), imgName, zIndex,
            alpha, rotation, scale);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height));
        }, resizeDependencies);

        return drawable;
    };

    ResizableStage.prototype.drawFreshWithInput = function (xFn, yFn, imgName, zIndex, resizeDependencies, alpha,
        rotation, scale) {
        var drawable = this.stage.drawFresh(xFn(this.width, this.height), yFn(this.height, this.width), imgName, zIndex,
            alpha, rotation, scale);
        var self = this;
        var input = self.createInput(drawable);
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height));
            self.changeInput(input, drawable);
        }, resizeDependencies);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStage.prototype.drawText = function (xFn, yFn, text, sizeFn, font, color, zIndex, resizeDependencies,
        rotation, alpha, fontStyle, maxLineLengthFn, lineHeightFn, scale) {

        var drawable = this.stage.drawText(xFn(this.width, this.height), yFn(this.height, this.width), text,
            sizeFn(this.width, this.height), font, color, zIndex, rotation, alpha, fontStyle,
            maxLineLengthFn ? maxLineLengthFn(this.width, this.height) : undefined,
            lineHeightFn ? lineHeightFn(this.height, this.width) : undefined, scale);

        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height));
            drawable.data.size = sizeFn(width, height);
            if (maxLineLengthFn)
                drawable.data.maxLineLength = maxLineLengthFn(width, height);
            if (lineHeightFn)
                drawable.data.lineHeight = lineHeightFn(height, width);
        }, resizeDependencies);

        return drawable;
    };

    ResizableStage.prototype.drawTextWithInput = function (xFn, yFn, text, sizeFn, font, color, zIndex,
        resizeDependencies, alpha, rotation, fontStyle, maxLineLengthFn, lineHeightFn, scale) {
        var drawable = this.stage.getDrawableText(xFn(this.width, this.height), yFn(this.height, this.width), zIndex,
            text, sizeFn(this.width, this.height), font, color, rotation, alpha, fontStyle,
            maxLineLengthFn ? maxLineLengthFn(this.width, this.height) : undefined,
            lineHeightFn ? lineHeightFn(this.height, this.width) : undefined, scale);
        this.stage.draw(drawable);
        var input = this.createInput(drawable);
        var self = this;
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height, width));
            drawable.data.size = sizeFn(width, height);
            if (maxLineLengthFn)
                drawable.data.maxLineLength = maxLineLengthFn(width, height);
            if (lineHeightFn)
                drawable.data.lineHeight = lineHeightFn(height, width);
            self.changeInput(input, drawable);
        }, resizeDependencies);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStage.prototype.drawRectangle = function (xFn, yFn, widthFn, heightFn, color, filled, lineWidthFn, zIndex,
        alpha, rotation, scale, resizeDependencies) {

        var lineWidth = lineWidthFn ? lineWidthFn(this.width, this.height) : undefined;
        var drawable = this.stage.drawRectangle(xFn(this.width, this.height), yFn(this.height, this.width),
            widthFn(this.width, this.height), heightFn(this.height, this.width), color, filled, lineWidth, zIndex,
            alpha, rotation, scale);

        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height, width));
            var lineWidth = lineWidthFn ? lineWidthFn(width, height) : undefined;
            changeRectangle(drawable.data, widthFn(width, height), heightFn(height, width), lineWidth);
        }, resizeDependencies);

        return drawable;
    };

    ResizableStage.prototype.drawCircle = function (xFn, yFn, radiusFn, color, filled, lineWidthFn, zIndex, alpha,
        rotation, scale, resizeDependencies) {

        var lineWidth = lineWidthFn ? lineWidthFn(this.width, this.height) : undefined;
        var drawable = this.stage.drawCircle(xFn(this.width, this.height), yFn(this.height, this.width),
            radiusFn(this.width, this.height), color, filled, lineWidth, zIndex, alpha, rotation, scale);

        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height, width));
            var lineWidth = lineWidthFn ? lineWidthFn(width, height) : undefined;
            drawable.data.radius = radiusFn(width, height);
            drawable.data.lineWidth = lineWidth;
        }, resizeDependencies);

        return drawable;
    };

    ResizableStage.prototype.drawEqTriangle = function (xFn, yFn, angle, radiusFn, color, filled, lineWidthFn, zIndex,
        alpha, rotation, scale, resizeDependencies) {
        var lineWidth = lineWidthFn ? lineWidthFn(this.width, this.height) : undefined;
        var drawable = this.stage.drawEqTriangle(xFn(this.width, this.height), yFn(this.height, this.width), angle,
            radiusFn(this.width, this.height), color, filled, lineWidth, zIndex, alpha, rotation, scale);

        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height, width));
            var lineWidth = lineWidthFn ? lineWidthFn(width, height) : undefined;
            drawable.data.radius = radiusFn(width, height);
            drawable.data.lineWidth = lineWidth;
        }, resizeDependencies);

        return drawable;
    };

    ResizableStage.prototype.drawRectangleWithInput = function (xFn, yFn, widthFn, heightFn, color, filled, lineWidthFn,
        zIndex, alpha, rotation, scale, resizeDependencies, customHitWidthFn, customHitHeightFn) {

        var lineWidth = lineWidthFn ? lineWidthFn(this.width, this.height) : undefined;
        var drawable = this.stage.drawRectangle(xFn(this.width, this.height), yFn(this.height, this.width),
            widthFn(this.width, this.height), heightFn(this.height, this.width), color, filled, lineWidth, zIndex,
            alpha, rotation, scale);

        if (customHitWidthFn) {
            var tempWidth = drawable.data.width;
            drawable.data.width = customHitWidthFn(this.width, this.height);
        }
        if (customHitHeightFn) {
            var tempHeight = drawable.data.height;
            drawable.data.height = customHitHeightFn(this.height, this.width);
        }

        var input = this.createInput(drawable);

        if (tempWidth)
            drawable.data.width = tempWidth;
        if (tempHeight)
            drawable.data.height = tempHeight;

        var self = this;
        this.resizer.add(drawable, function (width, height) {
            changeCoords(drawable, xFn(width, height), yFn(height, width));
            var lineWidth = lineWidthFn ? lineWidthFn(width, height) : undefined;
            changeRectangle(drawable.data, widthFn(width, height), heightFn(height, width), lineWidth);

            if (customHitWidthFn) {
                var tempWidth = drawable.data.width;
                drawable.data.width = customHitWidthFn(width, height);
            }
            if (customHitHeightFn) {
                var tempHeight = drawable.data.height;
                drawable.data.height = customHitHeightFn(height, width);
            }

            self.changeInput(input, drawable);

            if (tempWidth)
                drawable.data.width = tempWidth;
            if (tempHeight)
                drawable.data.height = tempHeight;
        }, resizeDependencies);

        return {
            drawable: drawable,
            input: input
        };
    };

    ResizableStage.prototype.resize = function (event) {
        this.width = event.width;
        this.height = event.height;
        if (this.gfx && this.gfx.resize)
            this.gfx.resize(event);
        this.stage.resize(event);
        this.resizer.call(event.width, event.height);

        iterateEntries(this.collisions, function (detector) {
            detector.resize(event);
        });
    };

    ResizableStage.prototype.animateFresh = function (xFn, yFn, imgPathName, numberOfFrames, loop, resizeDependencies,
        zIndex, alpha, rotation, scale) {

        var wrapper = this.stage.animateFresh(xFn(this.width, this.height), yFn(this.height, this.width), imgPathName,
            numberOfFrames, loop, zIndex, alpha, rotation, scale);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width, height), yFn(height, width));
        }, resizeDependencies);

        return wrapper;
    };

    ResizableStage.prototype.moveFresh = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing, loop, callback,
        resizeDependencies, zIndex, alpha, rotation, scale) {
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width, height), endYFn(height, width));
            }, resizeDependencies);
        };

        var enhancedCallBack;
        if (callback) {
            if (loop) {
                enhancedCallBack = callback;
            } else {
                enhancedCallBack = function () {
                    callback();
                    registerResizeAfterMove();
                }
            }
        } else {
            if (loop) {
                enhancedCallBack = undefined;
            } else {
                enhancedCallBack = registerResizeAfterMove;
            }
        }

        var wrapper = this.stage.moveFresh(xFn(this.width, this.height), yFn(this.height, this.width), imgName,
            endXFn(this.width, this.height), endYFn(this.height, this.width), speed, spacing, loop, enhancedCallBack,
            zIndex, alpha, rotation, scale);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width, height), yFn(height, width));
            changePath(wrapper.path, xFn(width, height), yFn(height, width), endXFn(width, height),
                endYFn(height, width));
        }, resizeDependencies);

        return wrapper;
    };

    ResizableStage.prototype.moveFreshText = function (xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed,
        spacing, loop, callback, resizeDependencies, zIndex, alpha, rotation, maxLineLengthFn, lineHeightFn) {

        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width, height), endYFn(height, width));
                wrapper.drawable.data.size = sizeFn(width, height);
                if (maxLineLengthFn)
                    wrapper.drawable.data.maxLineLength = maxLineLengthFn(width, height);
                if (lineHeightFn)
                    wrapper.drawable.data.lineHeight = lineHeightFn(height, width);
            }, resizeDependencies);
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

        var wrapper = this.stage.moveFreshText(xFn(this.width, this.height), yFn(this.height, this.width), text,
            sizeFn(this.width, this.height), font, color, endXFn(this.width, this.height),
            endYFn(this.height, this.width), speed, spacing, loop, enhancedCallBack, zIndex, alpha, rotation,
            maxLineLengthFn ? maxLineLengthFn(this.width, this.height) : undefined,
            lineHeightFn ? lineHeightFn(this.height, this.width) : undefined);

        this.resizer.add(wrapper.drawable, function (width, height) {
            changeCoords(wrapper.drawable, xFn(width, height), yFn(height, width));
            wrapper.drawable.data.size = sizeFn(width, height);
            if (maxLineLengthFn)
                wrapper.drawable.data.maxLineLength = maxLineLengthFn(width, height);
            if (lineHeightFn)
                wrapper.drawable.data.lineHeight = lineHeightFn(height, width);
            changePath(wrapper.path, xFn(width, height), yFn(height, width), endXFn(width, height),
                endYFn(height, width));
        }, resizeDependencies);

        return wrapper;

    };

    ResizableStage.prototype.moveFreshRoundTrip = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing,
        loopTheTrip, callbackTo, callbackReturn, resizeDependencies, zIndex, alpha, rotation, scale) {
        var self = this;
        var registerResizeReturn = function () {
            self.resizer.add(wrapper.drawable, function (width, height) {
                changeCoords(wrapper.drawable, endXFn(width, height), endYFn(height, width));
                changePath(wrapper.pathTo, xFn(width, height), yFn(height, width), endXFn(width, height),
                    endYFn(height, width));
                changePath(wrapper.pathReturn, endXFn(width, height), endYFn(height, width), xFn(width, height),
                    yFn(height, width));
            }, resizeDependencies);
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
                changeCoords(wrapper.drawable, xFn(width, height), yFn(height, width));
                changePath(wrapper.pathTo, xFn(width, height), yFn(height, width), endXFn(width, height),
                    endYFn(height, width));
                changePath(wrapper.pathReturn, endXFn(width, height), endYFn(height, width), xFn(width, height),
                    yFn(height, width));
            }, resizeDependencies);
        };

        var registerResizeTo = function () {
            if (loopTheTrip) {
                initResize();
            } else {
                self.resizer.add(wrapper.drawable, function (width, height) {
                    changeCoords(wrapper.drawable, xFn(width, height), yFn(height, width));
                }, resizeDependencies);
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

        var wrapper = this.stage.moveFreshRoundTrip(xFn(this.width, this.height), yFn(this.height, this.width), imgName,
            endXFn(this.width, this.height), endYFn(this.height, this.width), speed, spacing, loopTheTrip,
            enhancedCallBackTo, enhancedCallBackFrom, zIndex, alpha, rotation, scale);

        initResize();

        return wrapper;
    };

    ResizableStage.prototype.moveFreshLater = function (xFn, yFn, imgName, endXFn, endYFn, speed, spacing, delay, loop,
        callback, startedMovingCallback, resizeDependencies, zIndex, alpha, rotation, scale) {
        var returnObject = {};
        var self = this;
        this.timer.doLater(function () {
            if (startedMovingCallback) {
                startedMovingCallback();
            }
            var wrapper = self.moveFresh(xFn, yFn, imgName, endXFn, endYFn, speed, spacing, loop, callback,
                resizeDependencies, zIndex, alpha, rotation, scale);

            Object.keys(wrapper).forEach(function (key) {
                returnObject[key] = wrapper[key];
            });
        }, delay);
        return returnObject;
    };

    ResizableStage.prototype.moveFreshTextLater = function (xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed,
        spacing, delay, loop, callback, startedMovingCallback, resizeDependencies, zIndex, alpha, rotation,
        maxLineLengthFn, lineHeightFn) {
        var returnObject = {};
        var self = this;
        this.timer.doLater(function () {
            var wrapper = self.moveFreshText(xFn, yFn, text, sizeFn, font, color, endXFn, endYFn, speed, spacing, loop,
                callback, resizeDependencies, zIndex, alpha, rotation, maxLineLengthFn, lineHeightFn);

            Object.keys(wrapper).forEach(function (key) {
                returnObject[key] = wrapper[key];
            });

            if (startedMovingCallback) {
                startedMovingCallback();
            }
        }, delay);
        return returnObject;
    };

    ResizableStage.prototype.move = function (drawable, endXFn, endYFn, speed, spacing, loop, callback,
        resizeDependencies) {
        var pathId = {id: drawable.id + '_1'};
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.remove(pathId);

            if (drawable.data instanceof TextWrapper || drawable.data instanceof Rectangle) {
                // todo add all other entity classes or refactor
                var afterEntitySpecificStuff_nowXnYPosition_id = {id: drawable.id + '_2'};
                self.resizer.add(afterEntitySpecificStuff_nowXnYPosition_id, function (width, height) {
                    changeCoords(drawable, endXFn(width, height), endYFn(height, width));
                }, resizeDependencies);
            } else {
                resizeDependencies = resizeDependencies.filter(function (element) {
                    return element.id != drawable.id;
                });
                self.resizer.add(drawable, function (width, height) {
                    changeCoords(drawable, endXFn(width, height), endYFn(height, width));
                }, resizeDependencies);
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

        var path = this.stage.getPath(drawable.x, drawable.y, endXFn(this.width, this.height),
            endYFn(this.height, this.width), speed, spacing, loop);

        this.stage.move(drawable, path, enhancedCallBack);

        if (resizeDependencies) {
            resizeDependencies.push(drawable);
        } else {
            resizeDependencies = [drawable];
        }

        this.resizer.add(pathId, function (width, height) {
            changePath(path, drawable.x, drawable.y, endXFn(width, height), endYFn(height, width));
        }, resizeDependencies);
    };

    ResizableStage.prototype.moveCircular = function (drawable, xFn, yFn, radiusFn, startAngle, endAngle, speed,
        spacing, loop, callback, resizeDependencies) {

        var pathId = {id: drawable.id + '_1'};
        var self = this;
        var registerResizeAfterMove = function () {
            self.resizer.remove(pathId);

            if (drawable.data instanceof TextWrapper || drawable.data instanceof Rectangle) {
                // todo add all other entity classes or refactor
                var afterEntitySpecificStuff_nowXnYPosition_id = {id: drawable.id + '_2'};
                self.resizer.add(afterEntitySpecificStuff_nowXnYPosition_id, function (width, height) {
                    changeCoords(drawable, Vectors.getX(xFn(width, height), radiusFn(width, height), endAngle),
                        Vectors.getY(yFn(height, width), radiusFn(width, height), endAngle));
                }, resizeDependencies);
            } else {
                resizeDependencies = resizeDependencies.filter(function (element) {
                    return element.id != drawable.id;
                });
                self.resizer.add(drawable, function (width, height) {
                    changeCoords(drawable, Vectors.getX(xFn(width, height), radiusFn(width, height), endAngle),
                        Vectors.getY(yFn(height, width), radiusFn(width, height), endAngle));
                }, resizeDependencies);
            }
        };

        var enhancedCallBack;
        if (callback) {
            if (loop) {
                enhancedCallBack = callback;
            } else {
                enhancedCallBack = function () {
                    registerResizeAfterMove();
                    callback();
                }
            }
        } else {
            if (loop) {
                enhancedCallBack = undefined;
            } else {
                enhancedCallBack = registerResizeAfterMove;
            }
        }

        var path = this.stage.moveCircular(drawable, xFn(this.width, this.height), yFn(this.height, this.width),
            radiusFn(this.width, this.height), startAngle, endAngle, speed, spacing, loop, enhancedCallBack);

        if (resizeDependencies) {
            resizeDependencies.push(drawable);
        } else {
            resizeDependencies = [drawable];
        }

        this.resizer.add(pathId, function (width, height) {
            changePath(path, xFn(width, height), yFn(height, width), radiusFn(width, height));
        }, resizeDependencies);
    };

    ResizableStage.prototype.moveRoundTrip = function (drawable, endXFn, endYFn, speed, spacing, loopTheTrip,
        callbackTo, callbackReturn, resizeDependencies, zIndex, alpha, rotation, scale) {
        //todo implement
    };

    ResizableStage.prototype.moveLater = function (drawable, endXFn, endYFn, speed, spacing, loop, callback,
        resizeDependencies, duration, laterCallback) {
        var self = this;
        this.timer.doLater(function () {
            if (laterCallback) {
                laterCallback();
            }
            self.move(drawable, endXFn, endYFn, speed, spacing, loop, callback, resizeDependencies);

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

        if (drawable.mask)
            this.unmask(drawable);
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

    var MASK = '_mask';

    ResizableStage.prototype.mask = function (drawable, pointA_xFn, pointA_yFn, pointB_xFn, pointB_yFn) {
        var mask = this.stage.mask(drawable, pointA_xFn(this.width, this.height), pointA_yFn(this.height, this.width),
            pointB_xFn(this.width, this.height), pointB_yFn(this.height, this.width));

        var maskId = {
            id: drawable.id + MASK
        };
        this.resizer.add(maskId, function (width, height) {
            changeMask(mask, pointA_xFn(width, height), pointA_yFn(height, width), pointB_xFn(width, height),
                pointB_yFn(height, width));
        }, [drawable]);

        return mask;
    };

    ResizableStage.prototype.unmask = function (drawable) {
        var idOfPossibleClippingMask = {
            id: drawable.id + MASK
        };
        this.resizer.remove(idOfPossibleClippingMask);
        this.stage.unmask(drawable);
    };

    ResizableStage.prototype.update = function () {
        this.timer.update();
        this.stage.update();
    };

    return ResizableStage;
})(H5.changeCoords, H5.changePath, H5.CanvasImageCollisionDetector, H5.inheritMethods, H5.TextWrapper,
    H5.iterateEntries, Object, H5.changeRectangle, H5.changeMask, H5.Rectangle, H5.Vectors);