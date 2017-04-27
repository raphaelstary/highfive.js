H5.Camera = (function () {
    'use strict';

    function Camera(viewPort, maxX, maxY) {
        this.viewPort = viewPort;

        // 1st universe grid tiles (u,v)
        // 2nd universe px screen coordinates (x,y)
        // 3rd universe px space coordinates (x,y)
        // - while screen coordinates are relative, space coordinates are an absolute representation of tiles in px

        this.minX = this.viewPort.getWidthHalf();
        this.minY = this.viewPort.getHeightHalf();
        this.maxX = maxX;
        this.maxY = maxY;

        this.isPositionLocked = false;
        this.isShow = true;
        this.__zoom = 1;
    }

    Camera.prototype.calcScreenPosition = function (entity, drawable, ignoreScale, useDrawableScale) {
        if (this.__zoom === 1) {
            var cornerX = this.viewPort.getCornerX();
            var cornerY = this.viewPort.getCornerY();
            if (entity.getEndX() < cornerX || entity.getCornerX() > this.viewPort.getEndX() ||
                entity.getEndY() < cornerY || entity.getCornerY() > this.viewPort.getEndY()) {

                drawable.show = false;
                return;
            }

            drawable.show = this.isShow;

            drawable.x = entity.x - cornerX;
            drawable.y = entity.y - cornerY;
            if (!ignoreScale) {
                drawable.scale = entity.scale;
            }

            return;
        }

        var widthHalf = this.viewPort.getWidthHalf() / this.__zoom;
        var heightHalf = this.viewPort.getHeightHalf() / this.__zoom;
        var left = this.viewPort.x - widthHalf;
        var right = this.viewPort.x + widthHalf;
        var top = this.viewPort.y - heightHalf;
        var bottom = this.viewPort.y + heightHalf;

        var entityRight = entity.getEndX();
        var entityLeft = entity.getCornerX();
        var entityBottom = entity.getEndY();
        var entityTop = entity.getCornerY();

        if (entityRight < left || entityLeft > right || entityBottom < top || entityTop > bottom) {
            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.x = (entity.x - left) * this.__zoom;
        drawable.y = (entity.y - top) * this.__zoom;
        if (useDrawableScale) {
            if (drawable.currentScale === undefined) {
                drawable.currentScale = drawable.scale;
            }
            drawable.scale = drawable.currentScale * this.__zoom;
        } else {
            drawable.scale = entity.scale * this.__zoom;
        }
    };

    Camera.prototype.calcBulletsScreenPosition = function (entity, drawable) {
        var cornerX = this.viewPort.getCornerX();
        var cornerY = this.viewPort.getCornerY();

        var right = entity.data.ax > entity.data.bx ? entity.data.ax : entity.data.bx;
        var left = entity.data.ax < entity.data.bx ? entity.data.ax : entity.data.bx;
        var bottom = entity.data.ay > entity.data.by ? entity.data.ay : entity.data.by;
        var top = entity.data.ay < entity.data.by ? entity.data.ay : entity.data.by;

        if (right < cornerX || left > this.viewPort.getEndX() || bottom < cornerY || top > this.viewPort.getEndY()) {

            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.data.ax = entity.data.ax - cornerX * this.viewPort.scale;
        drawable.data.ay = entity.data.ay - cornerY * this.viewPort.scale;
        drawable.data.bx = entity.data.bx - cornerX * this.viewPort.scale;
        drawable.data.by = entity.data.by - cornerY * this.viewPort.scale;
    };

    Camera.prototype.move = function (anchor) {
        if (this.isPositionLocked) {
            return;
        }

        this.viewPort.x = anchor.x;
        this.viewPort.y = anchor.y;

        var minX = this.minX / this.__zoom;
        var minY = this.minY / this.__zoom;
        var maxX = this.__zoom !== 1 ? this.maxX + minX : this.maxX;
        var maxY = this.__zoom !== 1 ? this.maxY + minY : this.maxY;
        if (this.viewPort.x < minX) {
            this.viewPort.x = minX;
        }
        if (this.viewPort.x > maxX) {
            this.viewPort.x = maxX;
        }
        if (this.viewPort.y < minY) {
            this.viewPort.y = minY;
        }
        if (this.viewPort.y > maxY) {
            this.viewPort.y = maxY;
        }
    };

    Camera.prototype.unlockPosition = function () {
        this.isPositionLocked = false;
    };

    Camera.prototype.lockPosition = function () {
        this.isPositionLocked = true;
    };

    Camera.prototype.hideDrawables = function () {
        this.isShow = false;
    };

    Camera.prototype.showDrawables = function () {
        this.isShow = true;
    };

    Camera.prototype.zoom = function (factor) {
        this.__zoom = factor;
    };

    Camera.prototype.zoomRelative = function (factor) {
        this.__zoom += factor;
    };

    Camera.prototype.getZoom = function () {
        return this.__zoom;
    };

    return Camera;
})();