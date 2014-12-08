var ResizeBus = (function (iterateEntries) {
    "use strict";

    function ResizeBus(width, height) {
        this.resizeDict = {};

        this.width = width;
        this.height = height;
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

    return ResizeBus;
})(iterateEntries);