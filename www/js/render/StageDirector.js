var StageDirector = (function (Sprites, Drawables, Paths, Animations) {
    "use strict";

    function StageDirector(gfxCache, motions, spriteAnimations, animations, renderer) {
        this.gfxCache = gfxCache;
        this.motions = motions;
        this.spriteAnimations = spriteAnimations;
        this.animations = animations;
        this.renderer = renderer;

        this._id = 0;
    }

    StageDirector.prototype.getDrawable = function (x, y, imgPathName, zIndex, alpha, rotation, scale) {
        return Drawables.get(this.gfxCache, ++this._id, x, y, imgPathName, zIndex, alpha, rotation, scale);
    };

    StageDirector.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength, lineHeight) {
        return Drawables.getTxt(++this._id, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength, lineHeight);
    };

    StageDirector.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return Sprites.get(this.gfxCache, imgPathName, numberOfFrames, loop);
    };

    StageDirector.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return Paths.get(x, y, endX, endY, speed, spacingFn, loop);
    };

    StageDirector.prototype.getSubImage = function (imgPathName) {
        return this.gfxCache.get(imgPathName);
    };

    StageDirector.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames, loop, zIndex, alpha, rotation,
        scale) {
        var sprite = this.getSprite(imgPathName, numberOfFrames, loop);
        var drawable = this.getDrawable(x, y, imgPathName, zIndex, alpha, rotation, scale);

        this.animate(drawable, sprite);

        return {
            drawable: drawable,
            sprite: sprite
        };
    };

    StageDirector.prototype.animate = function (drawable, sprite, callback) {
        this.spriteAnimations.animate(drawable, sprite, callback);
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
    };

    StageDirector.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.item)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.item);
                if (callback !== undefined) {
                    callback();
                }
            }
        }
        this.spriteAnimations.animateLater(drawableToAdd, duration, extendedCallback);
    };

    StageDirector.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback, zIndex,
        alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    StageDirector.prototype.moveFreshText = function (x, y, msg, size, fontFamily, color, endX, endY, speed, spacing,
        loop, callback, zIndex, alpha, rotation, maxLineLength, lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength,
            lineHeight);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    StageDirector.prototype.moveFreshRoundTrip = function (x, y, imgName, endX, endY, speed, spacing, loopTheTrip,
        callbackTo, callbackReturn, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var pathTo = this.getPath(x, y, endX, endY, speed, spacing);
        var pathReturn = this.getPath(endX, endY, x, y, speed, spacing);

        this.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);

        return {
            drawable: drawable,
            pathTo: pathTo,
            pathReturn: pathReturn
        }
    };

    StageDirector.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback,
        startedMovingCallback, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        var movedItem = {item: drawable, path: path, ready: callback};
        this.moveLater(movedItem, delay, startedMovingCallback);

        return {
            drawable: drawable,
            path: path
        };
    };

    StageDirector.prototype.move = function (drawable, path, callback) {
        this.motions.move(drawable, path, callback);
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
    };

    StageDirector.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo,
                                                      callbackReturn) {
        var self = this;

        function startRoundTrip() {
            if (callbackTo) {
                self.move(drawable, pathTo, function () {
                    callbackTo();
                    fromBtoA();
                });
            } else {
                self.move(drawable, pathTo, fromBtoA);
            }
        }

        function fromAtoB() {
            if (self.has(drawable)) {
                startRoundTrip();
            }
        }
        function fromBtoA() {
            if (self.has(drawable)) {
                if (loopTheTrip) {
                    if (callbackReturn) {
                        self.move(drawable, pathReturn, function () {
                            callbackReturn();
                            fromAtoB();
                        });
                    } else {
                        self.move(drawable, pathReturn, fromAtoB);
                    }
                } else {
                    if (callbackReturn) {
                        self.move(drawable, pathReturn, callbackReturn);
                    } else {
                        self.move(drawable, pathReturn);
                    }
                }
            }
        }

        startRoundTrip();
    };

    StageDirector.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.item)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.item);
                if (callback !== undefined) {
                    callback();
                }
            }
        }
        this.motions.moveLater(drawableToAdd, duration, extendedCallback);
    };

    StageDirector.prototype.drawFresh = function (x, y, imgName, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    StageDirector.prototype.draw = function (drawable) {
        this.renderer.add(drawable);
    };

    StageDirector.prototype.drawText = function (x, y, text, size, font, color, zIndex, rotation, alpha, maxLineLength, lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, text, size, font, color, rotation, alpha, maxLineLength, lineHeight);
        this.draw(drawable);

        return drawable;
    };

    StageDirector.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        this.animations.animateAlpha(drawable, value, duration, easing, loop, callback);
    };

    StageDirector.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.animations.animateAlphaPattern(drawable, valuePairs, loop);
    };

    StageDirector.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        this.animations.animateRotation(drawable, value, duration, easing, loop, callback);
    };

    StageDirector.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.animations.animateRotationPattern(drawable, valuePairs, loop);
    };

    StageDirector.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        this.animations.animateScale(drawable, value, duration, easing, loop, callback);
    };

    StageDirector.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.animations.animateScalePattern(drawable, valuePairs, loop);
    };

    StageDirector.prototype.basicAnimation = function (drawable, setter, animation, callback) {
        this.animations.animate(drawable, setter, animation, callback);
    };

    StageDirector.prototype.basicAnimationLater = function (drawableToAdd, duration, callback) {
        this.animations.animateLater(drawableToAdd, duration, callback);
    };

    StageDirector.prototype.basicAnimationPattern = function (drawableWrapperList, loop) {
        this.animations.animateWithKeyFrames(drawableWrapperList, loop);
    };

    StageDirector.prototype.getAnimation = function (startValue, endValue, speed, spacingFn, loop) {
        return Animations.get(startValue, endValue, speed, spacingFn, loop);
    };

    StageDirector.prototype.remove = function (drawable) {
        if (this.spriteAnimations.has(drawable)) {
            this.spriteAnimations.remove(drawable);
        }
        if (this.animations.has(drawable)) {
            this.animations.remove(drawable);
        }
        if (this.motions.has(drawable)) {
            this.motions.remove(drawable);
        }
        if (this.renderer.has(drawable)) {
            this.renderer.remove(drawable);
        }
    };

    StageDirector.prototype.has = function (drawable) {
        return this.renderer.has(drawable) || this.motions.has(drawable) || this.spriteAnimations.has(drawable) ||
            this.animations.has(drawable);
    };

    StageDirector.prototype.tick = function () {
        this.renderer.draw();
        this.motions.update();
        this.spriteAnimations.update();
        this.animations.update();
    };

    StageDirector.prototype.resize = function (width, height) {
        this.renderer.resize(width, height);
    };

    StageDirector.prototype.pause = function (drawable) {
        this.motions.pause(drawable);
    };

    StageDirector.prototype.play = function (drawable) {
        this.motions.play(drawable);
    };

    return StageDirector;
})(Sprites, Drawables, Paths, Animations);