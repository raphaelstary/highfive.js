var Renderer = (function (Object, getFunctionName, SubImage, renderAtlas, TextWrapper, renderText, Rectangle,
    renderRectangle, DrawableLine, renderLine, Circle, renderCircle, ImageWrapper, renderImage, EquilateralTriangle,
    renderEqTriangle) {
    "use strict";

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        this.renderServices = {};
    }

    Renderer.prototype.resize = function (event) {
        if (event.devicePixelRatio > 1) {
            this.screen.style.width = event.cssWidth + 'px';
            this.screen.style.height = event.cssHeight + 'px';
            this.screen.width = this.screenWidth = event.width;
            this.screen.height = this.screenHeight = event.height;
        } else {
            this.screen.width = this.screenWidth = event.width;
            this.screen.height = this.screenHeight = event.height;
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
                if (!drawable.show)
                    return;

                self.ctx.save();

                if (drawable.mask) {
                    self.ctx.beginPath();
                    self.ctx.rect(drawable.mask.x, drawable.mask.y, drawable.mask.width, drawable.mask.height);
                    self.ctx.closePath();
                    self.ctx.clip();
                }

                if (drawable.alpha || drawable.alpha === 0) {
                    self.ctx.globalAlpha = drawable.alpha;
                }

                if (drawable.flipHorizontally) {
                    self.ctx.translate(drawable.getWidth(), 0);
                    self.ctx.scale(-1, 1);
                    if (drawable.rotation) {
                        self.ctx.translate(-drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                        self.ctx.rotate(drawable.rotation);
                        self.ctx.translate(drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                    }
                } else {
                    if (drawable.rotation) {
                        self.ctx.translate(drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                        self.ctx.rotate(drawable.rotation);
                        self.ctx.translate(-drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                    }
                }

                self.ctx.translate(drawable.anchorOffsetX, drawable.anchorOffsetY);

                // todo fixme: I don't work minified
                //self.renderServices[Object.getPrototypeOf(drawable.data).constructor.name](self.ctx, drawable);
                // i work minified:
                if (drawable.data instanceof EquilateralTriangle) {
                    renderEqTriangle(self.ctx, drawable);
                } else if (drawable.data instanceof SubImage) {
                    renderAtlas(self.ctx, drawable);
                } else if (drawable.data instanceof TextWrapper) {
                    renderText(self.ctx, drawable);
                } else if (drawable.data instanceof Rectangle) {
                    renderRectangle(self.ctx, drawable);
                } else if (drawable.data instanceof DrawableLine) {
                    renderLine(self.ctx, drawable);
                } else if (drawable.data instanceof Circle) {
                    renderCircle(self.ctx, drawable);
                } else if (drawable.data instanceof ImageWrapper) {
                    renderImage(self.ctx, drawable);
                }

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
})(Object, getFunctionName, SubImage, renderAtlas, TextWrapper, renderText, Rectangle, renderRectangle, DrawableLine,
    renderLine, Circle, renderCircle, ImageWrapper, renderImage, EquilateralTriangle, renderEqTriangle);