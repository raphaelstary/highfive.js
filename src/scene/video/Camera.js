H5.Camera = (function () {
    'use strict';

    function Camera(viewPort, maxXFn, maxYFn, device) {
        this.__viewPort = viewPort;
        this.__device = device;

        // 1st universe grid tiles (u,v)
        // 2nd universe px screen coordinates (x,y)
        // 3rd universe px space coordinates (x,y)
        // - while screen coordinates are relative, space coordinates are an absolute representation of tiles in px

        this.__maxXFn = maxXFn;
        this.__maxYFn = maxYFn;

        /** @public */
        this.isPositionLocked = false;
        /** @public */
        this.isShow = true;
        /** @public */
        this.zoomFactor = 1;
    }

    Camera.prototype.calcScreenPosition = function (entity, drawable, ignoreScale, useDrawableScale) {
        if (this.zoomFactor === 1) {
            var cornerX = this.__viewPort.getCornerX();
            var cornerY = this.__viewPort.getCornerY();
            if (entity.getEndX() < cornerX || entity.getCornerX() > this.__viewPort.getEndX() ||
                entity.getEndY() < cornerY || entity.getCornerY() > this.__viewPort.getEndY()) {

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

        var widthHalf = this.__viewPort.getWidthHalf() / this.zoomFactor;
        var heightHalf = this.__viewPort.getHeightHalf() / this.zoomFactor;
        var left = this.__viewPort.x - widthHalf;
        var right = this.__viewPort.x + widthHalf;
        var top = this.__viewPort.y - heightHalf;
        var bottom = this.__viewPort.y + heightHalf;

        var entityRight = entity.getEndX();
        var entityLeft = entity.getCornerX();
        var entityBottom = entity.getEndY();
        var entityTop = entity.getCornerY();

        if (entityRight < left || entityLeft > right || entityBottom < top || entityTop > bottom) {
            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.x = (entity.x - left) * this.zoomFactor;
        drawable.y = (entity.y - top) * this.zoomFactor;
        if (useDrawableScale) {
            if (drawable.currentScale === undefined) {
                drawable.currentScale = drawable.scale;
            }
            drawable.scale = drawable.currentScale * this.zoomFactor;
        } else {
            drawable.scale = entity.scale * this.zoomFactor;
        }
    };

    Camera.prototype.calcBulletsScreenPosition = function (entity, drawable) {
        var cornerX = this.__viewPort.getCornerX();
        var cornerY = this.__viewPort.getCornerY();

        var right = entity.data.ax > entity.data.bx ? entity.data.ax : entity.data.bx;
        var left = entity.data.ax < entity.data.bx ? entity.data.ax : entity.data.bx;
        var bottom = entity.data.ay > entity.data.by ? entity.data.ay : entity.data.by;
        var top = entity.data.ay < entity.data.by ? entity.data.ay : entity.data.by;

        if (right < cornerX || left > this.__viewPort.getEndX() || bottom < cornerY ||
            top > this.__viewPort.getEndY()) {

            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.data.ax = entity.data.ax - cornerX * this.__viewPort.scale;
        drawable.data.ay = entity.data.ay - cornerY * this.__viewPort.scale;
        drawable.data.bx = entity.data.bx - cornerX * this.__viewPort.scale;
        drawable.data.by = entity.data.by - cornerY * this.__viewPort.scale;
    };

    Camera.prototype.move = function (anchor) {
        if (this.isPositionLocked) {
            return;
        }

        this.__viewPort.x = anchor.x;
        this.__viewPort.y = anchor.y;

        var minX = this.__viewPort.getWidthHalf() / this.zoomFactor;
        var minY = this.__viewPort.getHeightHalf() / this.zoomFactor;
        var maxX = this.zoomFactor !== 1 ? this.__maxXFn(this.__device.width, this.__device.height) + minX :
            this.__maxXFn(this.__device.width, this.__device.height);
        var maxY = this.zoomFactor !== 1 ? this.__maxYFn(this.__device.height, this.__device.width) + minY :
            this.__maxYFn(this.__device.height, this.__device.width);
        if (this.__viewPort.x < minX) {
            this.__viewPort.x = minX;
        }
        if (this.__viewPort.x > maxX) {
            this.__viewPort.x = maxX;
        }
        if (this.__viewPort.y < minY) {
            this.__viewPort.y = minY;
        }
        if (this.__viewPort.y > maxY) {
            this.__viewPort.y = maxY;
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
        this.zoomFactor = factor;
    };

    Camera.prototype.zoomRelative = function (factor) {
        this.zoomFactor += factor;
    };

    return Camera;
})();