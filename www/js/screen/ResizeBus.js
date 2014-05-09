var ResizeBus = (function () {
    "use strict";

    function ResizeBus() {
        this.resizeDict = {};
    }

    ResizeBus.prototype.add = function (id, callback) {
        this.resizeDict[id] = callback;
    };

    ResizeBus.prototype.remove = function (id) {
        delete  this.resizeDict[id];
    };

    ResizeBus.prototype.callResize = function (width, height, factorWidth, factorHeight) {
        for (var key in this.resizeDict) {
            if (this.resizeDict.hasOwnProperty(key)) {
                this.resizeDict[key](width, height, factorWidth, factorHeight);
            }
        }
    };

    return ResizeBus;
})();