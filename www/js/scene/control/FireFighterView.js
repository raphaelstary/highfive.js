var FireFighterView = (function (calcScreenConst) {
    "use strict";

    function FireFighterView(fireFighterDrawable, bg, screenWidth) {
        this.fireFighterDrawable = fireFighterDrawable;
        this.bg = bg;
        this.screenWidth = screenWidth;
        this.speedFactor = 200;
        this.speed = calcScreenConst(screenWidth, this.speedFactor);
        this.__moveRight = true;
        this.__running = false;
    }

    FireFighterView.prototype.start = function () {
        this.__running = true;
    };

    FireFighterView.prototype.tick = function () {
        if (!this.__running)
            return;

        if (this.__moveRight) {
            this.fireFighterDrawable.x += this.speed;
            var widthRight = this.fireFighterDrawable.x + this.fireFighterDrawable.getWidth() / 2;
            if (widthRight > this.screenWidth || widthRight > this.bg.getEndX()) {
                this.__moveRight = false;
            }
        } else {
            this.fireFighterDrawable.x -= this.speed;
            var widthLeft = this.fireFighterDrawable.x - this.fireFighterDrawable.getWidth() / 2;
            if (widthLeft < 0 || widthLeft < this.bg.getCornerX()) {
                this.__moveRight = true;
            }
        }
    };

    FireFighterView.prototype.resize = function (width) {
        this.screenWidth = width;
        this.speed = calcScreenConst(width, this.speedFactor);
    };

    return FireFighterView;
})(calcScreenConst);