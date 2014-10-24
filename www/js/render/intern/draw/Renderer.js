var Renderer = (function () {
    "use strict";

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = {'0': {}, '1': {}, '2': {}, '3': {}};
        this.renderServices = {};
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
                    self.ctx.translate(elem.getAnchorX(), elem.getAnchorY());
                    self.ctx.rotate(elem.rotation);
                    self.ctx.translate(-elem.getAnchorX(), -elem.getAnchorY());
                }

                self.renderServices[Object.getPrototypeOf(elem)](self.ctx, elem);

                self.ctx.restore();
            }
        }
    };

    Renderer.prototype.registerRenderer = function (prototype, fn) {
        this.renderServices[prototype] = fn;
    };

    return Renderer;
})();