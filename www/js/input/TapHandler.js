var TapHandler = (function (isHit, iterateSomeEntries) {
    "use strict";

    function TapHandler() {
        this.elements = {};
        this.disabled = {};
    }

    TapHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        var self = this;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            (function (touch) {
                iterateSomeEntries(self.elements, function (element) {
                    if (isHit(touch, element.touchable)) {
                        element.callback();
                        return true;
                    }
                    return false;
                });
            })(touch);
        }
    };

    TapHandler.prototype.click = function (event) {
        iterateSomeEntries(this.elements, function (elem) {
            if (isHit(event, elem.touchable)) {
                elem.callback();
                return true;
            }
            return false;
        });
    };

    TapHandler.prototype.add = function (touchable, callback) {
        this.elements[touchable.id] = {
            touchable: touchable,
            callback: callback
        }
    };

    TapHandler.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
        delete this.disabled[touchable.id];
    };

    TapHandler.prototype.disable = function (touchable) {
        this.disabled[touchable.id] = this.elements[touchable.id];
        delete this.elements[touchable.id];
    };

    TapHandler.prototype.enable = function (touchable) {
        this.elements[touchable.id] = this.disabled[touchable.id];
        delete this.disabled[touchable.id];
    };

    return TapHandler;
})(isHit, iterateSomeEntries);