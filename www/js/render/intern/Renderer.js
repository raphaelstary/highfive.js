var Renderer = (function (wrapText, Math) {
    "use strict";

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = {'0': {}, '1': {}, '2': {}, '3': {}};
    }

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype.add = function (drawable) {
        this.drawableDict[drawable.zIndex][drawable.id] = drawable;
    };

    Renderer.prototype.remove = function (drawable) {
        delete this.drawableDict[drawable.zIndex][drawable.id];
    };

    Renderer.prototype.has = function (drawable) {
        return this.drawableDict[drawable.zIndex][drawable.id] !== undefined;
    };

    Renderer.prototype.draw = function () {
        var self = this;
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        for (var key in this.drawableDict) {
            iterate(this.drawableDict[key]);
        }

        function iterate(dict) {
            for (var key in dict) {
                var elem = dict[key];

                self.ctx.save();

                if (elem.alpha || elem.alpha === 0) {
                    self.ctx.globalAlpha = elem.alpha;
                }

                if (elem.rotation) {
                    self.ctx.translate(elem.x, elem.y);
                    self.ctx.rotate(elem.rotation);
                    self.ctx.translate(-elem.x, -elem.y);
                }

                if (elem.scale != 1) {
                    self.ctx.drawImage(elem.img.img, elem.img.x, elem.img.y, elem.img.width, elem.img.height,
                        elem.getCornerX(), elem.getCornerY(), elem.getWidth(), elem.getHeight());
                } else {
                    self.ctx.drawImage(elem.img.img, elem.img.x, elem.img.y,
                        elem.img.width, elem.img.height,
                        elem.x + elem.img.offSetX,
                        elem.y + elem.img.offSetY,
                        elem.img.trimmedTileWidth,
                        elem.img.trimmedTileHeight);
                }



                self.ctx.restore();
            }
        }

        for (key in this.drawableTxtDict) {
            var elem = this.drawableTxtDict[key];

            this.ctx.save();

            if (elem.alpha || elem.alpha === 0) {
                this.ctx.globalAlpha = elem.alpha;
            }
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = elem.txt.color;
            this.ctx.font = Math.floor(elem.txt.size * elem.scale) + 'px ' + elem.txt.fontFamily;

            if (elem.rotation) {
                this.ctx.translate(elem.x, elem.y);
                this.ctx.rotate(elem.rotation);
                this.ctx.translate(-elem.x, -elem.y);
            }

            var txtIsToLong =
                elem.txt.maxLineLength && this.ctx.measureText(elem.txt.msg).width > elem.txt.maxLineLength;
            if (txtIsToLong) {
                wrapText(this.ctx, elem.txt.msg, elem.x, elem.y, elem.txt.maxLineLength, elem.txt.lineHeight);
            } else {
                this.ctx.fillText(elem.txt.msg, elem.x, elem.y);
            }

            this.ctx.restore();
        }


    };

    return Renderer;
})(wrapText, Math);