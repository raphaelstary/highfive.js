var ResizeBus = (function () {
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

    ResizeBus.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;

        for (var key in this.resizeDict) {
            if (this.resizeDict.hasOwnProperty(key)) {
                this.resizeDict[key](width, height);
            }
        }
    };

    ResizeBus.prototype.getWidth = function () {
        return this.width;
    };

    ResizeBus.prototype.getHeight = function () {
        return this.height;
    };

    return ResizeBus;
})();