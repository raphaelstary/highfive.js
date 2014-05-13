var PushReleaseController = (function () {
    "use strict";

    function PushReleaseController() {
        this.touchElements = {};

        this.onGoingTouches = {};
    }

    PushReleaseController.prototype.touchStart = function (event) {
        event.preventDefault();

        for (var key in this.touchElements) {
            if (!this.touchElements.hasOwnProperty(key)) {
                continue;
            }
            var elem = this.touchElements[key];
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                if (this._isHit(touch, elem)) {
                    this.onGoingTouches[touches[i].identifier] = elem;
                    elem.push();
                }
            }
        }
    };

    PushReleaseController.prototype.touchEnd = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var activeElem = this.onGoingTouches[touches[i].identifier];

            if (activeElem !== undefined) {
                delete this.onGoingTouches[touches[i].identifier];
                activeElem.release();
            }
        }
    };

    PushReleaseController.prototype.mouseDown = function (event) {

        for (var key in this.touchElements) {
            if (!this.touchElements.hasOwnProperty(key)) {
                continue;
            }
            var elem = this.touchElements[key];

            if (this._isHit(event, elem)) {
                this._currentMouse = elem;
                elem.push();
                return;
            }
        }
    };

    PushReleaseController.prototype.mouseUp = function (event) {
        if (this._currentMouse === undefined) {
            return;
        }
        this._currentMouse.release();
        delete this._currentMouse;
    };

    PushReleaseController.prototype.add = function (touchable, pushCallback, releaseCallback) {
        this.touchElements[touchable.id] = {item: touchable, push: pushCallback, release: releaseCallback};
    };

    PushReleaseController.prototype.remove = function (touchable) {
        delete this.touchElements[touchable.id];
    };

    PushReleaseController.prototype._isHit = function (pointer, element) {
        return pointer.clientX > element.item.x && pointer.clientX < element.item.x + element.item.width &&
            pointer.clientY > element.item.y && pointer.clientY < element.item.y + element.item.height;
    };

    return PushReleaseController;
})();