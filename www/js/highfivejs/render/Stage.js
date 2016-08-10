H5.Stage = (function (Sprites, Drawables, Paths, Animations, Math) {
    "use strict";

    function Stage(gfxCache, motions, motionTimer, motionHelper, spriteAnimations, spriteTimer, animations,
        animationHelper, animationTimer, propertyAnimations, renderer, timer) {
        this.gfxCache = gfxCache;
        this.motions = motions;
        this.motionTimer = motionTimer;
        this.motionHelper = motionHelper;
        this.spriteTimer = spriteTimer;
        this.spriteAnimations = spriteAnimations;
        this.animations = animations;
        this.animationHelper = animationHelper;
        this.animationTimer = animationTimer;
        this.propertyAnimations = propertyAnimations;
        this.renderer = renderer;
        this.timer = timer;

        this._id = 0;
    }

    Stage.prototype.getImageWidth = function (name) {
        return Math.floor(this.gfxCache.get(name).width * this.gfxCache.defaultScaleFactor);
    };

    Stage.prototype.getImageHeight = function (name) {
        return Math.floor(this.gfxCache.get(name).height * this.gfxCache.defaultScaleFactor);
    };

    Stage.prototype.getDrawable = function (x, y, imgPathName, zIndex, alpha, rotation, scale) {
        return Drawables.getGraphic(this.gfxCache, ++this._id, x, y, imgPathName, zIndex, alpha, rotation, scale);
    };

    Stage.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
        maxLineLength, lineHeight, scale) {
        return Drawables.getTxt(++this._id, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
            maxLineLength, lineHeight, scale);
    };

    Stage.prototype.getDrawableRectangle = function (x, y, width, height, color, filled, lineWidth, zIndex, alpha,
        rotation, scale) {
        return Drawables.getRect(++this._id, x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
    };

    Stage.prototype.getDrawableQuadrilateral = function (ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth,
        zIndex, alpha, rotation, scale) {
        return Drawables.getQuad(++this._id, ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
    };

    Stage.prototype.getDrawableABLine = function (ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        return Drawables.getABLine(++this._id, ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale);
    };

    Stage.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return Sprites.get(this.gfxCache, imgPathName, numberOfFrames, loop);
    };

    Stage.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return Paths.getLine(x, y, endX, endY, speed, spacingFn, loop);
    };

    Stage.prototype.getGraphic = function (imgPathName) {
        return this.gfxCache.get(imgPathName);
    };

    Stage.prototype.changeZIndex = function (drawable, newZIndex) {
        if (drawable.zIndex != newZIndex)
            this.renderer.changeZIndex(drawable, newZIndex);
        return drawable;
    };

    Stage.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames, loop, zIndex, alpha, rotation, scale) {
        var sprite = this.getSprite(imgPathName, numberOfFrames, loop);
        var drawable = this.getDrawable(x, y, imgPathName, zIndex, alpha, rotation, scale);

        this.animate(drawable, sprite);

        return {
            drawable: drawable,
            sprite: sprite
        };
    };

    Stage.prototype.animate = function (drawable, sprite, callback) {
        this.spriteAnimations.animate(drawable, sprite, callback);
        this.__softAdd(drawable);
    };

    Stage.prototype.__softAdd = function (drawable) {
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
    };

    Stage.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.drawable)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.drawable);
                if (callback) {
                    callback();
                }
            }
        }
        this.spriteTimer.animateLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback, zIndex, alpha,
        rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshText = function (x, y, msg, size, fontFamily, color, endX, endY, speed, spacing, loop,
        callback, zIndex, alpha, rotation, fontStyle, maxLineLength, lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
            maxLineLength, lineHeight);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshRoundTrip = function (x, y, imgName, endX, endY, speed, spacing, loopTheTrip, callbackTo,
        callbackReturn, zIndex, alpha, rotation, scale) {
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

    Stage.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback,
        startedMovingCallback, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        var movedItem = {
            drawable: drawable,
            path: path,
            callback: callback
        };
        this.moveLater(movedItem, delay, startedMovingCallback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.move = function (drawable, path, callback) {
        this.motions.animate(drawable, path, callback);
    };

    Stage.prototype.moveQuad = function (property, drawable, path, callback) {
        this.motions.animateQuad(property, drawable, path, callback);
    };

    Stage.prototype.moveCircular = function (drawable, x, y, radius, startAngle, endAngle, speed, spacingFn, loop,
        callback) {

        var path = Paths.getCircle(x, y, radius, startAngle, endAngle, speed, spacingFn, loop);
        this.motions.animate(drawable, path, callback);

        return path;
    };

    Stage.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn) {
        this.motionHelper.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);
    };

    Stage.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.drawable)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.drawable);
                if (callback) {
                    callback();
                }
            }
        }
        this.motionTimer.moveLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.drawFresh = function (x, y, imgName, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.draw = function (drawable) {
        this.renderer.add(drawable);
    };

    Stage.prototype.drawText = function (x, y, text, size, font, color, zIndex, rotation, alpha, fontStyle,
        maxLineLength, lineHeight, scale) {
        var drawable = this.getDrawableText(x, y, zIndex, text, size, font, color, rotation, alpha, fontStyle,
            maxLineLength, lineHeight, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawRectangle = function (x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = this.getDrawableRectangle(x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawQuadrilateral = function (ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex,
        alpha, rotation, scale) {
        var drawable = this.getDrawableQuadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex,
            alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawABLine = function (ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawableABLine(ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawCircle = function (x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = Drawables.getCircle(++this._id, x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawLine = function (x, y, length, color, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = Drawables.getLine(++this._id, x, y, length, color, lineWidth, zIndex, alpha, rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawEqTriangle = function (x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = Drawables.getEqTriangle(++this._id, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawHexagon = function (x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = Drawables.getHexagon(++this._id, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateAlpha(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateAlphaPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateRotation(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateRotationPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateScale(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateScalePattern(drawable, valuePairs, loop);
    };

    Stage.prototype.mask = function (drawable, pointA_x, pointA_y, pointB_x, pointB_y) {
        drawable.mask = Drawables.getMask(pointA_x, pointA_y, pointB_x - pointA_x, pointB_y - pointA_y);
        return drawable.mask;
    };

    Stage.prototype.unmask = function (drawable) {
        delete drawable.mask;
    };

    Stage.prototype.basicAnimation = function (drawable, setter, animation, callback) {
        this.animations.animate(drawable, setter, animation, callback);
    };

    Stage.prototype.basicAnimationLater = function (drawableToAdd, duration, callback) {
        this.animationTimer.animateLater(drawableToAdd, duration, callback);
    };

    Stage.prototype.basicAnimationPattern = function (drawableWrapperList, loop) {
        this.animationHelper.animateWithKeyFrames(drawableWrapperList, loop);
    };

    Stage.prototype.getAnimation = function (startValue, endValue, speed, spacingFn, loop) {
        return Animations.get(startValue, endValue, speed, spacingFn, loop);
    };

    Stage.prototype.remove = function (drawable) {
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

    Stage.prototype.has = function (drawable) {
        return this.renderer.has(drawable) || this.motions.has(drawable) || this.spriteAnimations.has(drawable) ||
            this.animations.has(drawable);
    };

    Stage.prototype.clear = function () {
        this.renderer.clear();
    };

    Stage.prototype.update = function () {
        // move stuff
        this.timer.update();
        this.motions.update();
        this.spriteAnimations.update();
        this.animations.update();

        // draw stuff
        this.renderer.draw();
    };

    Stage.prototype.resize = function (event) {
        this.renderer.resize(event);
    };

    Stage.prototype.pause = function (drawable) {
        if (this.motions.has(drawable))
            this.motions.pause(drawable);
        if (this.animations.has(drawable))
            this.animations.pause(drawable);
        if (this.spriteAnimations.has(drawable))
            this.spriteAnimations.pause(drawable);
    };

    Stage.prototype.play = function (drawable) {
        if (this.motions.has(drawable))
            this.motions.play(drawable);
        if (this.animations.has(drawable))
            this.animations.play(drawable);
        if (this.spriteAnimations.has(drawable))
            this.spriteAnimations.play(drawable);
    };

    Stage.prototype.pauseAll = function () {
        this.motions.pauseAll();
        this.animations.pauseAll();
        this.spriteAnimations.pauseAll();
    };

    Stage.prototype.playAll = function () {
        this.motions.playAll();
        this.animations.playAll();
        this.spriteAnimations.playAll();
    };

    return Stage;
})(H5.Sprites, H5.Drawables, H5.Paths, H5.Animations, Math);