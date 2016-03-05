H5.TapManager = (function (isHit, iterateSomeEntries, iterateEntries) {
    "use strict";

    function TapManager() {
        this.elements = {};
        this.disabled = {};
    }

    TapManager.prototype.inputChanged = function (pointer) {
        if (pointer.type == 'move' || pointer.type == 'up')
            return;
        iterateSomeEntries(this.elements, function (elem) {
            if (isHit(pointer, elem.touchable)) {
                elem.callback();
                return true;
            }
            return false;
        }, this);
    };

    TapManager.prototype.add = function (touchable, callback) {
        this.elements[touchable.id] = {
            touchable: touchable,
            callback: callback
        }
    };

    TapManager.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
        delete this.disabled[touchable.id];
    };

    TapManager.prototype.disable = function (touchable) {
        this.disabled[touchable.id] = this.elements[touchable.id];
        delete this.elements[touchable.id];
    };

    TapManager.prototype.disableAll = function () {
        iterateEntries(this.elements, function (wrapper, id) {
            this.disabled[id] = wrapper;
            delete this.elements[id];
        }, this);
    };

    TapManager.prototype.enable = function (touchable) {
        this.elements[touchable.id] = this.disabled[touchable.id];
        delete this.disabled[touchable.id];
    };

    TapManager.prototype.enableAll = function () {
        iterateEntries(this.disabled, function (wrapper, id) {
            this.elements[id] = wrapper;
            delete this.disabled[id];
        }, this);
    };

    return TapManager;
})(H5.isHit, H5.iterateSomeEntries, H5.iterateEntries);