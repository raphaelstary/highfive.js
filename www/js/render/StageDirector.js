var StageDirector = (function () {
    "use strict";

    function StageDirector(atlasMapper, motions, animations, renderer) {
        this.atlasMapper = atlasMapper;
        this.motions = motions;
        this.animations = animations;
        this.renderer = renderer;
    }

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
})();