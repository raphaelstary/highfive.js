var StageDirector = (function (Sprites, Drawables, Paths) {
    "use strict";

    function StageDirector(atlasMapper, motions, animations, renderer) {
        this.atlasMapper = atlasMapper;
        this.motions = motions;
        this.animations = animations;
        this.renderer = renderer;

        this._id = 0;
    }

    StageDirector.prototype.getDrawable = function (x, y, imgPathName, zIndex) {
        return Drawables.get(this.atlasMapper, ++this._id, x, y, imgPathName, zIndex);
    };

    StageDirector.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation) {
        return Drawables.getTxt(++this._id, x, y, zIndex, msg, size, fontFamily, color, rotation);
    };

    StageDirector.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return Sprites.get(this.atlasMapper, imgPathName, numberOfFrames, loop);
    };

    StageDirector.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return Paths.get(x, y, endX, endY, speed, spacingFn, loop);
    };

    StageDirector.prototype.getSubImage = function (imgPathName) {
        return this.atlasMapper.get(imgPathName);
    };

    StageDirector.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames) {
        var sprite = this.getSprite(imgPathName, numberOfFrames);
        var drawable = this.getDrawable(x, y, imgPathName);

        this.animate(drawable, sprite);

        return drawable;
    };

    StageDirector.prototype.animate = function (drawable, sprite, callback) {
        this.animations.animate(drawable, sprite, callback);
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
        this.animations.animateLater(drawableToAdd, duration, extendedCallback);
    };

    StageDirector.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback) {
        var drawable = this.getDrawable(x, y, imgName);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return drawable;
    };

    StageDirector.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback) {
        var drawable = this.getDrawable(x, y, imgName);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        var movedItem = {item: drawable, path: path, ready: callback};
        this.moveLater(movedItem, delay);

        return drawable;
    };

    StageDirector.prototype.move = function (drawable, path, callback) {
        this.motions.move(drawable, path, callback);
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
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

    StageDirector.prototype.drawFresh = function (x, y, imgName, zIndex) {
        var drawable = this.getDrawable(x, y, imgName, zIndex);
        this.draw(drawable);

        return drawable;
    };

    StageDirector.prototype.draw = function (drawable) {
        this.renderer.add(drawable);
    };

    StageDirector.prototype.remove = function (drawable) {
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

    StageDirector.prototype.tick = function () {
        this.renderer.draw();
        this.motions.update();
        this.animations.update();
    };

    StageDirector.prototype.resize = function (width, height, factorWidth) {
        this.atlasMapper.resize(width, height, factorWidth);
        this.renderer.resize(width, height);
    };

    return StageDirector;
})(Sprites, Drawables, Paths);