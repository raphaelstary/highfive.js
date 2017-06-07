H5.Camera = (function (Math) {
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

    Camera.prototype.updatePositionReference = function (sourceDrawable, targetDrawable, scale, offsetX, offsetY,
        rotationOffsetX, rotationOffsetY) {
        this.__calculatePositionData(sourceDrawable, targetDrawable, true, scale, offsetX, offsetY, rotationOffsetX,
            rotationOffsetY);
    };

    Camera.prototype.__calculatePositionData = function (entity, drawable, justUseEntitiesPosition, forcedScaleFactor,
        forcedOffsetX, forcedOffsetY, forcedRotationOffsetX, forcedRotationOffsetY) {

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
                drawable.rotation = entity.rotation;
                drawable.alpha = entity.alpha;
                drawable.scale = entity.scale;
                drawable.rotationAnchorOffsetX = entity.rotationAnchorOffsetX;
                drawable.rotationAnchorOffsetY = entity.rotationAnchorOffsetY;
                drawable.anchorOffsetX = entity.anchorOffsetX;
                drawable.anchorOffsetY = entity.anchorOffsetY;
                drawable.flipHorizontally = entity.flipHorizontally;
                drawable.flipVertically = entity.flipVertically;

            } else {
                drawable.scale = forcedScaleFactor !== undefined ? forcedScaleFactor : 1;
                drawable.anchorOffsetX = forcedOffsetX !== undefined ? forcedOffsetX : 0;
                drawable.anchorOffsetY = forcedOffsetY !== undefined ? forcedOffsetY : 0;
                drawable.rotationAnchorOffsetX = forcedRotationOffsetX !== undefined ? forcedRotationOffsetX : 0;
                drawable.rotationAnchorOffsetY = forcedRotationOffsetY !== undefined ? forcedRotationOffsetY : 0;
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
            drawable.rotation = entity.rotation;
            drawable.alpha = entity.alpha;
            drawable.flipHorizontally = entity.flipHorizontally;
            drawable.flipVertically = entity.flipVertically;

            drawable.scale = entity.scale * this.zoomFactor;
            drawable.anchorOffsetX = Math.floor(entity.anchorOffsetX * this.zoomFactor);
            drawable.anchorOffsetY = Math.floor(entity.anchorOffsetY * this.zoomFactor);

            drawable.rotationAnchorOffsetX = Math.floor(entity.rotationAnchorOffsetX * this.zoomFactor);
            drawable.rotationAnchorOffsetY = Math.floor(entity.rotationAnchorOffsetY * this.zoomFactor);

        } else {
            var scale = forcedScaleFactor !== undefined ? forcedScaleFactor : 1;
            drawable.scale = scale * this.zoomFactor;

            var offsetX = forcedOffsetX !== undefined ? forcedOffsetX : 0;
            drawable.anchorOffsetX = Math.floor(offsetX * this.zoomFactor);

            var offsetY = forcedOffsetY !== undefined ? forcedOffsetY : 0;
            drawable.anchorOffsetY = Math.floor(offsetY * this.zoomFactor);

            var rotationOffsetX = forcedRotationOffsetX !== undefined ? forcedRotationOffsetX : 0;
            drawable.rotationAnchorOffsetX = Math.floor(rotationOffsetX * this.zoomFactor);

            var rotationOffsetY = forcedRotationOffsetY !== undefined ? forcedRotationOffsetY : 0;
            drawable.rotationAnchorOffsetY = Math.floor(rotationOffsetY * this.zoomFactor);
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

        var widthHalf = this.__viewPort.getWidthHalf() / this.zoomFactor;
        var heightHalf = this.__viewPort.getHeightHalf() / this.zoomFactor;

        var left = widthHalf;
        var maxX = this.__maxXFn(this.__device.width, this.__device.height, this.zoomFactor);
        if (maxX < widthHalf * 2) {
            maxX = Math.floor(widthHalf * 2);
        }
        var right = maxX - widthHalf;
        var top = heightHalf;
        var maxY = this.__maxYFn(this.__device.height, this.__device.width, this.zoomFactor);
        if (maxY < heightHalf * 2) {
            maxY = Math.floor(heightHalf * 2);
        }
        var bottom = maxY - heightHalf;

        if (this.__viewPort.x < left) {
            this.__viewPort.x = left;
        } else if (this.__viewPort.x > right) {
            this.__viewPort.x = right;
        }
        if (this.__viewPort.y < top) {
            this.__viewPort.y = top;
        } else if (this.__viewPort.y > bottom) {
            this.__viewPort.y = bottom;
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
})(Math);