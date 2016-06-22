H5.Taps = (function (isHit, iterateSomeEntries, iterateEntries) {
    "use strict";

    function Taps() {
        this.elements = {};
        this.disabled = {};
    }

    Taps.prototype.inputChanged = function (pointer) {
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

    Taps.prototype.add = function (touchable, callback) {
        this.elements[touchable.id] = {
            touchable: touchable,
            callback: callback
        }
    };

    Taps.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
        delete this.disabled[touchable.id];
    };

    Taps.prototype.disable = function (touchable) {
        this.disabled[touchable.id] = this.elements[touchable.id];
        delete this.elements[touchable.id];
    };

    Taps.prototype.disableAll = function () {
        iterateEntries(this.elements, function (wrapper, id) {
            this.disabled[id] = wrapper;
            delete this.elements[id];
        }, this);
    };

    Taps.prototype.enable = function (touchable) {
        this.elements[touchable.id] = this.disabled[touchable.id];
        delete this.disabled[touchable.id];
    };

    Taps.prototype.enableAll = function () {
        iterateEntries(this.disabled, function (wrapper, id) {
            this.elements[id] = wrapper;
            delete this.disabled[id];
        }, this);
    };

    return Taps;
})(H5.isHit, H5.iterateSomeEntries, H5.iterateEntries);