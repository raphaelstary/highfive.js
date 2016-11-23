H5.Camera = (function () {
    "use strict";

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
    }

    Camera.prototype.calcScreenPosition = function (entity, drawable) {
        var cornerX = this.viewPort.getCornerX();
        var cornerY = this.viewPort.getCornerY();
        if (entity.getEndX() < cornerX || entity.getCornerX() > this.viewPort.getEndX() || entity.getEndY() < cornerY ||
            entity.getCornerY() > this.viewPort.getEndY()) {

            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.x = entity.x - cornerX * this.viewPort.scale;
        drawable.y = entity.y - cornerY * this.viewPort.scale;
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
        if (this.isPositionLocked)
            return;

        this.viewPort.x = anchor.x;
        this.viewPort.y = anchor.y;

        if (this.viewPort.x < this.minX) this.viewPort.x = this.minX;
        if (this.viewPort.x > this.maxX) this.viewPort.x = this.maxX;
        if (this.viewPort.y < this.minY) this.viewPort.y = this.minY;
        if (this.viewPort.y > this.maxY) this.viewPort.y = this.maxY;
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

    return Camera;
})();