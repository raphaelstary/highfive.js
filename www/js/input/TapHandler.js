var TapHandler = (function (isHit) {
    "use strict";

    function TapHandler() {
        this.elements = {};
    }

    TapHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        for (var key in this.elements) {
            var elem = this.elements[key];

            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];

                if (isHit(touch, elem.touchable)) {

                    elem.callback();
                    return;
                }
            }
        }
    };

    TapHandler.prototype.click = function (event) {

        for (var key in this.elements) {
            var elem = this.elements[key];

            if (isHit(event, elem.touchable)) {

                elem.callback();
                return;
            }
        }
    };

    TapHandler.prototype.add = function (touchable, callback) {
        this.elements[touchable.id] = {touchable: touchable, callback: callback}
    };

    TapHandler.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
    };

    return TapHandler;
})(isHit);