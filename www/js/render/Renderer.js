var Renderer = (function () {
    "use strict";

    function Renderer(screen, ctx, atlas) {
        this.screen = screen;
        this.ctx = ctx;

        this.atlas = atlas;

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawables = [];
    }

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype.add = function (drawable) {
        this.drawables.push(drawable);
    };

    Renderer.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        var self = this;
        this.drawables.forEach(function (elem) {
            self.ctx.drawImage(self.atlas, elem.img.x, elem.img.y,
                elem.img.width, elem.img.height,
                self._getImgRenderXPoint(elem.x, elem.img),
                self._getImgRenderYPoint(elem.y, elem.img),
                self._getImgRenderWidth(elem.img),
                self._getImgRenderHeight(elem.img));
        });
    };

    var baseTileWidth = 1920 / 480,
        tileOffSet = Math.floor(baseTileWidth * 0.5);

    Renderer.prototype._getImgRenderXPoint = function (x, subImage) {
        return x * baseTileWidth + (tileOffSet * subImage.tileWidth) + subImage.offSetX;
    };

    Renderer.prototype._getImgRenderYPoint = function (y, subImage) {
        return y * baseTileWidth + (tileOffSet * subImage.tileHeight) + subImage.offSetY;
    };

    Renderer.prototype._getImgRenderWidth = function (subImage) {
        return Math.floor(subImage.trimmedTileWidth * baseTileWidth);
    };

    Renderer.prototype._getImgRenderHeight = function (subImage) {
        return Math.floor(subImage.trimmedTileHeight * baseTileWidth);
    };

    return Renderer;
})();