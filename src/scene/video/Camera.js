H5.Camera = (function (concatenateProperties, Math) {
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

    Camera.prototype.updateBinding = function (sourceDrawable, targetDrawable) {
        this.__calculatePositionData(sourceDrawable, targetDrawable);
    };

    Camera.prototype.updatePositionReference = function (sourceDrawable, targetDrawable, scale, anchorX, anchorY) {
        this.__calculatePositionData(sourceDrawable, targetDrawable, true, scale, anchorX, anchorY);
    };

    Camera.prototype.__calculatePositionData = function (entity, drawable, justUseEntitiesPosition, forcedScaleFactor,
        forcedAnchorX, forcesAnchorY) {

        if (!this.show) {
            drawable.show = false;
            return;
        }

        if (this.zoomFactor === 1) {
            var cornerX = this.__viewPort.getCornerX();
            var cornerY = this.__viewPort.getCornerY();
            if (entity.getEndXAnchored() < cornerX || entity.getCornerXAnchored() > this.__viewPort.getEndX() ||
                entity.getEndYAnchored() < cornerY || entity.getCornerYAnchored() > this.__viewPort.getEndY()) {

                drawable.show = false;
                return;
            }

            if (!justUseEntitiesPosition) {
                var id = drawable.id;
                var zIndex = drawable.zIndex;
                concatenateProperties(entity, drawable);
                drawable.id = id;
                drawable.zIndex = zIndex;
            } else {
                drawable.scale = forcedScaleFactor !== undefined ? forcedScaleFactor : 1;
                drawable.anchorOffsetX = forcedAnchorX !== undefined ? forcedAnchorX : 0;
                drawable.anchorOffsetY = forcesAnchorY !== undefined ? forcesAnchorY : 0;
            }

            drawable.x = entity.x - cornerX;
            drawable.y = entity.y - cornerY;
            drawable.show = true;

            return;
        }

        var widthHalf = this.__viewPort.getWidthHalf() / this.zoomFactor;
        var heightHalf = this.__viewPort.getHeightHalf() / this.zoomFactor;
        var left = this.__viewPort.x - widthHalf;
        var right = this.__viewPort.x + widthHalf;
        var top = this.__viewPort.y - heightHalf;
        var bottom = this.__viewPort.y + heightHalf;

        var entityRight = entity.getEndXAnchored();
        var entityLeft = entity.getCornerXAnchored();
        var entityBottom = entity.getEndYAnchored();
        var entityTop = entity.getCornerYAnchored();

        if (entityRight < left || entityLeft > right || entityBottom < top || entityTop > bottom) {
            drawable.show = false;
            return;
        }

        if (!justUseEntitiesPosition) {
            var tempId = drawable.id;
            var tempZIndex = drawable.zIndex;
            concatenateProperties(entity, drawable);
            drawable.id = tempId;
            drawable.zIndex = tempZIndex;

            drawable.scale = entity.scale * this.zoomFactor;
            drawable.anchorOffsetX = Math.floor(entity.anchorOffsetX * this.zoomFactor);
            drawable.anchorOffsetY = Math.floor(entity.anchorOffsetY * this.zoomFactor);

        } else {
            var scale = forcedScaleFactor !== undefined ? forcedScaleFactor : 1;
            drawable.scale = scale * this.zoomFactor;

            var offsetX = forcedAnchorX !== undefined ? forcedAnchorX : 0;
            drawable.anchorOffsetX = Math.floor(offsetX * this.zoomFactor);

            var offsetY = forcesAnchorY !== undefined ? forcesAnchorY : 0;
            drawable.anchorOffsetY = Math.floor(offsetY * this.zoomFactor);
        }

        drawable.x = Math.floor((entity.x - left) * this.zoomFactor);
        drawable.y = Math.floor((entity.y - top) * this.zoomFactor);
        drawable.show = true;
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
})(H5.concatenateProperties, Math);