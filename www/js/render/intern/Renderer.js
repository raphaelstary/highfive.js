var Renderer = (function () {
    "use strict";

    function Renderer(screen, ctx, atlas) {
        this.screen = screen;
        this.ctx = ctx;

        this.atlas = atlas;

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = {'0': {}, '1': {}, '2': {}, '3': {}};
        this.drawableTxtDict = {};
    }

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype.add = function (drawable) {
        if (drawable.txt) {
            this.drawableTxtDict[drawable.id] = drawable;
        } else {
            this.drawableDict[drawable.zIndex][drawable.id] = drawable;
        }
    };

    Renderer.prototype.remove = function (drawable) {
        if (drawable.txt) {
            delete this.drawableTxtDict[drawable.id];
        } else {
            delete this.drawableDict[drawable.zIndex][drawable.id];
        }
    };

    Renderer.prototype.has = function (drawable) {
        return this.drawableDict[drawable.zIndex][drawable.id] !== undefined ||
            this.drawableTxtDict[drawable.id];
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

                self.ctx.drawImage(self.atlas, elem.img.x, elem.img.y,
                    elem.img.width, elem.img.height,
                        elem.x + elem.img.offSetX,
                        elem.y + elem.img.offSetY,
                    elem.img.trimmedTileWidth,
                    elem.img.trimmedTileHeight);
            }
        }

        for (key in this.drawableTxtDict) {
            var elem = this.drawableTxtDict[key];

            this.ctx.save();

            if (elem.txt.alpha || elem.txt.alpha === 0) {
                this.ctx.globalAlpha = elem.txt.alpha;
            }
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = elem.txt.color;
            this.ctx.font = elem.txt.size + 'px ' + elem.txt.fontFamily;

            if (elem.txt.rotation) {
                this.ctx.translate(elem.x, elem.y);
                this.ctx.rotate(elem.txt.rotation);
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

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
        }
    };

    return Renderer;
})();