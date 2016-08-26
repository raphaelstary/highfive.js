H5.Renderer = (function (Object, Math, getFunctionName, SubImage, renderAtlas, TextWrapper, renderText, Rectangle,
    renderRectangle, DrawableLine, renderLine, Circle, renderCircle, ImageWrapper, renderImage, EquilateralTriangle,
    renderEqTriangle, Quadrilateral, renderQuadrilateral, ABLine, renderABLine, Hexagon, renderHexagon) {
    "use strict";

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
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

    Renderer.prototype.changeZIndex = function (drawable, newZIndex) {
        this.drawableDict[newZIndex][drawable.id] = this.drawableDict[drawable.zIndex][drawable.id];
        delete this.drawableDict[drawable.zIndex][drawable.id];
        drawable.zIndex = newZIndex;
    };

    Renderer.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    };

    Renderer.prototype.draw = function () {
        var self = this;
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
                    if (drawable.mask.rotation) {
                        self.ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                        self.ctx.rotate(drawable.mask.rotation);
                        self.ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                    }

                    self.ctx.beginPath();
                    if (drawable.mask.data instanceof Rectangle) {
                        self.ctx.rect(drawable.mask.getCornerX() - 0.5, drawable.mask.getCornerY() - 0.5,
                            drawable.mask.getWidth(), drawable.mask.getHeight());

                    } else if (drawable.mask.data instanceof Circle) {
                        self.ctx.arc(drawable.mask.x, drawable.mask.y, drawable.mask.getWidthHalf(), 0, 2 * Math.PI);

                    }

                    self.ctx.closePath();
                    self.ctx.clip();

                    if (drawable.mask.rotation) {
                        self.ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                        self.ctx.rotate(-drawable.mask.rotation);
                        self.ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                    }
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
                } else if (drawable.data instanceof Quadrilateral) {
                    renderQuadrilateral(self.ctx, drawable);
                } else if (drawable.data instanceof ABLine) {
                    renderABLine(self.ctx, drawable);
                } else if (drawable.data instanceof Hexagon) {
                    renderHexagon(self.ctx, drawable);
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
})(Object, Math, H5.getFunctionName, H5.SubImage, H5.renderAtlas, H5.TextWrapper, H5.renderText, H5.Rectangle,
    H5.renderRectangle, H5.DrawableLine, H5.renderLine, H5.Circle, H5.renderCircle, H5.ImageWrapper, H5.renderImage,
    H5.EquilateralTriangle, H5.renderEqTriangle, H5.Quadrilateral, H5.renderQuadrilateral, H5.ABLine, H5.renderABLine,
    H5.Hexagon, H5.renderHexagon);