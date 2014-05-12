var TapController = (function () {
    "use strict";

    function TapController() {
        this.touchElements = {};
    }

    TapController.prototype.touchStart = function (event) {
        event.preventDefault();

        for (var key in this.touchElements) {
            if (!this.touchElements.hasOwnProperty(key)) {
                continue;
            }
            var elem = this.touchElements[key];

            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];

                if (this._isHit(touch, elem)) {

                    elem.action();
                    return;
                }
            }
        }
    };

    TapController.prototype.click = function (event) {

        for (var key in this.touchElements) {
            if (!this.touchElements.hasOwnProperty(key)) {
                continue;
            }
            var elem = this.touchElements[key];

            if (this._isHit(event, elem)) {

                elem.action();
                return;
            }
        }
    };

    TapController.prototype.add = function (touchable, callback) {
        this.touchElements[touchable.id] = {item: touchable, action: callback}
    };

    TapController.prototype.remove = function (touchable) {
        delete this.touchElements[touchable.id];
    };

    TapController.prototype._isHit = function (pointer, element) {
        return pointer.clientX > element.item.x && pointer.clientX < element.item.x + element.item.width &&
            pointer.clientY > element.item.y && pointer.clientY < element.item.y + element.item.height;
    };

    return TapController;
})();