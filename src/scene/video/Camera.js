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
        this.locked = false;
        /** @public */
        this.show = true;
        /** @public */
        this.zoomFactor = 1;
    }

    Camera.prototype.calculatePosition = function (entity, drawable, ignoreScale, forcedScaleFactor) {
        if (this.zoomFactor === 1) {
            var cornerX = this.__viewPort.getCornerX();
            var cornerY = this.__viewPort.getCornerY();
            if (entity.getEndX() < cornerX || entity.getCornerX() > this.__viewPort.getEndX() ||
                entity.getEndY() < cornerY || entity.getCornerY() > this.__viewPort.getEndY()) {

                drawable.show = false;
                return;
            }

            drawable.show = this.show;

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

        drawable.show = this.show;

        drawable.x = (entity.x - left) * this.zoomFactor;
        drawable.y = (entity.y - top) * this.zoomFactor;

        if (forcedScaleFactor !== undefined) {
            drawable.scale = forcedScaleFactor * this.zoomFactor;
        } else {
            drawable.scale = entity.scale * this.zoomFactor;
        }
    };

    /**
     * todo rework + change name & extract common feature set out of specific bullet code
     * @deprecated
     */
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

        drawable.show = this.show;

        drawable.data.ax = entity.data.ax - cornerX * this.__viewPort.scale;
        drawable.data.ay = entity.data.ay - cornerY * this.__viewPort.scale;
        drawable.data.bx = entity.data.bx - cornerX * this.__viewPort.scale;
        drawable.data.by = entity.data.by - cornerY * this.__viewPort.scale;
    };

    Camera.prototype.move = function (anchor) {
        if (this.locked) {
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

    Camera.prototype.unlock = function () {
        this.locked = false;
    };

    Camera.prototype.lock = function () {
        this.locked = true;
    };

    Camera.prototype.hideAll = function () {
        this.show = false;
    };

    Camera.prototype.showAll = function () {
        this.show = true;
    };

    Camera.prototype.zoom = function (factor) {
        this.zoomFactor = factor;
    };

    Camera.prototype.zoomRelatively = function (factor) {
        this.zoomFactor += factor;
    };

    return Camera;
})();