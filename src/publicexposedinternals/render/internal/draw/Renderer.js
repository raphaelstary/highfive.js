H5.Renderer = (function (Object, Math, $) {
    'use strict';

    function Renderer(screen) {
        this.__screen = screen;
        this.__ctx = screen.getContext('2d');

        this.__screenWidth = screen.width;
        this.__screenHeight = screen.height;

        this.__drawables = [];
    }

    Renderer.prototype.resize = function (event) {
        if (event.devicePixelRatio > 1) {
            this.__screen.style.width = event.cssWidth + 'px';
            this.__screen.style.height = event.cssHeight + 'px';
            this.__screen.width = this.__screenWidth = event.width;
            this.__screen.height = this.__screenHeight = event.height;
        } else {
            this.__screen.width = this.__screenWidth = event.width;
            this.__screen.height = this.__screenHeight = event.height;
        }
    };

    Renderer.prototype.add = function (drawable) {
        for (var i = 0; i < this.__drawables.length; i++) {
            if (drawable.zIndex < this.__drawables[i].zIndex) {
                this.__drawables.splice(i, 0, drawable);
                return;
            }
        }
        this.__drawables.push(drawable);
    };

    Renderer.prototype.remove = function (drawable) {
        for (var i = 0; i < this.__drawables.length; i++) {
            if (this.__drawables[i].id == drawable.id) {
                this.__drawables.splice(i, 1);
                return;
            }
        }
    };

    Renderer.prototype.has = function (drawable) {
        for (var i = 0; i < this.__drawables.length; i++) {
            if (this.__drawables[i].id == drawable.id) {
                return true;
            }
        }
        return false;
    };

    Renderer.prototype.changeZIndex = function (drawable, newZIndex) {
        for (var i = 0; i < this.__drawables.length; i++) {
            if (this.__drawables[i].id == drawable.id) {
                this.__drawables.splice(i, 1);
                break;
            }
        }

        drawable.zIndex = newZIndex;

        for (var j = 0; j < this.__drawables.length; j++) {
            if (drawable.zIndex < this.__drawables[j].zIndex) {
                this.__drawables.splice(j, 0, drawable);
                return;
            }
        }
        this.__drawables.push(drawable);
    };

    Renderer.prototype.clear = function () {
        this.__ctx.clearRect(0, 0, this.__screenWidth, this.__screenHeight);
    };

    Renderer.prototype.draw = function () {
        for (var i = 0; i < this.__drawables.length; i++) {
            var drawable = this.__drawables[i];
            if (!drawable.show) {
                continue;
            }

            this.__ctx.save();

            if (drawable.mask) {
                if (drawable.mask.rotation) {
                    this.__ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                    this.__ctx.rotate(drawable.mask.rotation);
                    this.__ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                }

                this.__ctx.beginPath();
                if (drawable.mask.data instanceof $.Rectangle) {
                    this.__ctx.rect(drawable.mask.getCornerX() - 0.5, drawable.mask.getCornerY() - 0.5,
                        drawable.mask.getWidth(), drawable.mask.getHeight());

                } else if (drawable.mask.data instanceof $.Circle) {
                    this.__ctx.arc(drawable.mask.x, drawable.mask.y, drawable.mask.getWidthHalf(), 0, 2 * Math.PI);

                }

                this.__ctx.closePath();
                this.__ctx.clip();

                if (drawable.mask.rotation) {
                    this.__ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                    this.__ctx.rotate(-drawable.mask.rotation);
                    this.__ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                }
            }

            if (drawable.alpha || drawable.alpha === 0) {
                this.__ctx.globalAlpha = drawable.alpha;
            }

            if (drawable.flipHorizontally) {
                this.__ctx.translate(drawable.getWidth(), 0);
                this.__ctx.scale(-1, 1);
                if (drawable.rotation) {
                    this.__ctx.translate(-drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                    this.__ctx.rotate(drawable.rotation);
                    this.__ctx.translate(drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                }
            } else {
                if (drawable.rotation) {
                    this.__ctx.translate(drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                    this.__ctx.rotate(drawable.rotation);
                    this.__ctx.translate(-drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                }
            }

            this.__ctx.translate(drawable.anchorOffsetX, drawable.anchorOffsetY);

            if (drawable.data instanceof $.EquilateralTriangle) {
                $.renderEqTriangle(this.__ctx, drawable);
            } else if (drawable.data instanceof $.SubImage) {
                $.renderAtlas(this.__ctx, drawable);
            } else if (drawable.data instanceof $.TextWrapper) {
                $.renderText(this.__ctx, drawable);
            } else if (drawable.data instanceof $.Rectangle) {
                $.renderRectangle(this.__ctx, drawable);
            } else if (drawable.data instanceof $.DrawableLine) {
                $.renderLine(this.__ctx, drawable);
            } else if (drawable.data instanceof $.Circle) {
                $.renderCircle(this.__ctx, drawable);
            } else if (drawable.data instanceof $.ImageWrapper) {
                $.renderImage(this.__ctx, drawable);
            } else if (drawable.data instanceof $.Quadrilateral) {
                $.renderQuadrilateral(this.__ctx, drawable);
            } else if (drawable.data instanceof $.ABLine) {
                $.renderABLine(this.__ctx, drawable);
            } else if (drawable.data instanceof $.Hexagon) {
                $.renderHexagon(this.__ctx, drawable);
            }

            this.__ctx.restore();
        }
    };

    return Renderer;
})(Object, Math, H5);