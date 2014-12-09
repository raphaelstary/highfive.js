var PushReleaseHandler = (function (isHit, iterateEntries, iterateSomeEntries) {
    "use strict";

    function PushReleaseHandler() {
        this.elements = {};
        this.disabled = {};
        this.onGoingTouches = {};
    }

    PushReleaseHandler.prototype.touchStart = function (event) {
        event.preventDefault();
        var self = this;
        for (var i = 0; i < event.changedTouches.length; i++) {
            iterate(event.changedTouches[i]);
        }

        function iterate(touch) {
            iterateEntries(self.elements, function (touchable) {
                if (isHit(touch, touchable.item)) {
                    self.onGoingTouches[touch.identifier] = touchable;
                    touchable.push();
                }
            });
        }
    };

    PushReleaseHandler.prototype.touchEnd = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var activeElem = this.onGoingTouches[touches[i].identifier];

            if (activeElem) {
                delete this.onGoingTouches[touches[i].identifier];
                activeElem.release();
            }
        }
    };

    PushReleaseHandler.prototype.mouseDown = function (event) {
        iterateSomeEntries(this.elements, function (touchable) {
            if (isHit(event, touchable.item)) {
                this._currentMouse = touchable;
                touchable.push();
                return true;
            }
            return false;
        }, this);
    };

    PushReleaseHandler.prototype.mouseUp = function () {
        if (!this._currentMouse) {
            return;
        }
        this._currentMouse.release();
        delete this._currentMouse;
    };

    PushReleaseHandler.prototype.add = function (touchable, pushCallback, releaseCallback) {
        this.elements[touchable.id] = {
            item: touchable,
            push: pushCallback,
            release: releaseCallback
        };
    };

    PushReleaseHandler.prototype.disable = function (touchable) {
        this.disabled[touchable.id] = this.elements[touchable.id];
        delete this.elements[touchable.id];
    };

    PushReleaseHandler.prototype.enable = function (touchable) {
        this.elements[touchable.id] = this.disabled[touchable.id];
        delete this.disabled[touchable.id];
    };

    PushReleaseHandler.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
        delete this.disabled[touchable.id];
    };

    return PushReleaseHandler;
})(isHit, iterateEntries, iterateSomeEntries);