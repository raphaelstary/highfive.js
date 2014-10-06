var PushReleaseHandler = (function (isHit) {
    "use strict";

    function PushReleaseHandler() {
        this.elements = {};

        this.onGoingTouches = {};
    }

    PushReleaseHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        for (var key in this.elements) {
            var elem = this.elements[key];
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                if (isHit(touch, elem.item)) {
                    this.onGoingTouches[touches[i].identifier] = elem;
                    elem.push();
                }
            }
        }
    };

    PushReleaseHandler.prototype.touchEnd = function (event) {
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

    PushReleaseHandler.prototype.mouseDown = function (event) {

        for (var key in this.elements) {
            var elem = this.elements[key];

            if (isHit(event, elem.item)) {
                this._currentMouse = elem;
                elem.push();
                return;
            }
        }
    };

    PushReleaseHandler.prototype.mouseUp = function (event) {
        if (this._currentMouse === undefined) {
            return;
        }
        this._currentMouse.release();
        delete this._currentMouse;
    };

    PushReleaseHandler.prototype.add = function (touchable, pushCallback, releaseCallback) {
        this.elements[touchable.id] = {item: touchable, push: pushCallback, release: releaseCallback};
    };

    PushReleaseHandler.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
    };

    return PushReleaseHandler;
})(isHit);