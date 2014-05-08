var Renderer = (function () {
    "use strict";

    function Renderer(screen, ctx, atlas) {
        this.screen = screen;
        this.ctx = ctx;

        this.atlas = atlas;

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = {};
    }

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype.add = function (drawable) {
        this.drawableDict[drawable.id] = drawable;
    };

    Renderer.prototype.remove = function (drawable) {
        delete this.drawableDict[drawable.id];
    };

    Renderer.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        var self = this;
        for (var key in this.drawableDict) {
            if (this.drawableDict.hasOwnProperty(key)) {
                var elem = this.drawableDict[key];

                self.ctx.drawImage(self.atlas, elem.img.x, elem.img.y,
                    elem.img.width, elem.img.height,
                    self._getImgRenderXPoint(elem.x, elem.img),
                    self._getImgRenderYPoint(elem.y, elem.img),
                    self._getImgRenderWidth(elem.img),
                    self._getImgRenderHeight(elem.img));
            }
        }
    };

    Renderer.prototype.nextFrame = function () {
        for (var key in this.drawableDict) {
            if (this.drawableDict.hasOwnProperty(key)) {
                var elem = this.drawableDict[key];
                if (elem.sprite === undefined) {
                    continue;
                }

                elem.img = elem.sprite.frames[++elem.sprite.current];
                if (elem.sprite.current >= elem.sprite.frames.length) {
                    elem.sprite.current = 0;
                    elem.img = elem.sprite.frames[0];
                }
            }
        }
    };

    var baseTileWidth = 1,
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