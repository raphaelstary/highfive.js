H5.CanvasImageCollisionDetector = (function (document) {
    "use strict";

    function CanvasImageCollisionDetector(baseDrawable) {
        this.drawable = baseDrawable;

        var canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');

        canvas.width = this.width = baseDrawable.getWidth();
        canvas.height = this.height = baseDrawable.getHeight();
    }

    CanvasImageCollisionDetector.prototype.isHit = function (drawable) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.drawable.data.img, 0, 0, this.drawable.getWidth(), this.drawable.getHeight());

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-in';

        var x = drawable.getCornerX() - this.drawable.getCornerX();
        var y = drawable.getCornerY() - this.drawable.getCornerY();

        this.ctx.drawImage(drawable.data.img, x, y, drawable.getWidth(), drawable.getHeight());

        this.ctx.restore();

        var sourceWidth = x + drawable.getWidth();
        var sourceHeight = y + drawable.getHeight();
        if (sourceWidth < 1 || sourceHeight < 1)
            return false;

        var rawPixelData = this.ctx.getImageData(0, 0, sourceWidth, sourceHeight).data;

        for (var i = 0; i < rawPixelData.length; i += 4) {
            var alphaValue = rawPixelData[i + 3];
            if (alphaValue != 0) {
                return true;
            }
        }
        return false;
    };

    CanvasImageCollisionDetector.prototype.resize = function () {
        this.ctx.canvas.width = this.width = this.drawable.getWidth();
        this.ctx.canvas.height = this.height = this.drawable.getHeight();
    };

    return CanvasImageCollisionDetector;
})(window.document);