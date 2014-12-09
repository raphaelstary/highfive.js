var ResizeBus = (function (iterateEntries) {
    "use strict";

    function ResizeBus(width, height, cssWidth, cssHeight, pixelRatio) {
        this.resizeDict = {};

        this.width = width;
        this.height = height;
        this.cssWidth = cssWidth;
        this.cssHeight = cssHeight;
        this.pixelRatio = pixelRatio;
    }

    ResizeBus.prototype.add = function (id, callback) {
        this.resizeDict[id] = callback;
    };

    ResizeBus.prototype.remove = function (id) {
        delete  this.resizeDict[id];
    };

    ResizeBus.prototype.resize = function (width, height, cssWidth, cssHeight, pixelRatio) {
        this.width = width;
        this.height = height;
        this.cssWidth = cssWidth;
        this.cssHeight = cssHeight;
        this.pixelRatio = pixelRatio;

        iterateEntries(this.resizeDict, function (fn) {
            fn(width, height, cssWidth, cssHeight, pixelRatio);
        });
    };

    ResizeBus.prototype.getWidth = function () {
        return this.width;
    };

    ResizeBus.prototype.getHeight = function () {
        return this.height;
    };

    ResizeBus.prototype.forceResize = function () {
        iterateEntries(this.resizeDict, function (fn) {
            fn(this.width, this.height, this.cssWidth, this.cssHeight, this.pixelRatio);
        }, this);
    };

    return ResizeBus;
})(iterateEntries);