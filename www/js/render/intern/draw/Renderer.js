var Renderer = (function (Object, getFunctionName) {
    "use strict";

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
        this.renderServices = {};
    }

    Renderer.prototype.resize = function (width, height, cssWidth, cssHeight, pixelRatio) {
        if (pixelRatio > 1) {
            this.screen.style.width = cssWidth + 'px';
            this.screen.style.height = cssHeight + 'px';
            this.screen.width = this.screenWidth = width;
            this.screen.height = this.screenHeight = height;
        } else {
            this.screen.width = this.screenWidth = width;
            this.screen.height = this.screenHeight = height;
        }
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

        Object.keys(self.drawableDict).forEach(function (key) {
            iterate(self.drawableDict[key]);
        });

        function iterate(layer) {
            Object.keys(layer).forEach(function (key) {
                var drawable = layer[key];

                self.ctx.save();

                if (drawable.mask) {
                    self.ctx.beginPath();
                    self.ctx.rect(drawable.mask.x, drawable.mask.y, drawable.mask.width, drawable.mask.height);
                    self.ctx.clip();
                }

                if (drawable.alpha || drawable.alpha === 0) {
                    self.ctx.globalAlpha = drawable.alpha;
                }

                if (drawable.rotation) {
                    self.ctx.translate(drawable.getAnchorX(), drawable.getAnchorY());
                    self.ctx.rotate(drawable.rotation);
                    self.ctx.translate(-drawable.getAnchorX(), -drawable.getAnchorY());
                }

                self.renderServices[Object.getPrototypeOf(drawable.data).constructor.name](self.ctx, drawable);

                self.ctx.restore();
            });
        }
    };

    Renderer.prototype.registerRenderer = function (prototype, fn) {
        if (prototype.constructor.name)
            this.renderServices[prototype.constructor.name] = fn; else {
            var functionName = getFunctionName(prototype.constructor);
            this.renderServices[functionName] = fn;
            prototype.constructor.name = functionName;
        }
    };

    return Renderer;
})(Object, getFunctionName);