var KeyPushReleaseHandler = (function (Object) {
    "use strict";

    function KeyPushReleaseHandler() {
        this.keys = {};
        this.activeKeys = {};
    }

    KeyPushReleaseHandler.prototype.add = function (keyCode, pushCallback, releaseCallback) {
        this.keys[keyCode] = {push: pushCallback, release: releaseCallback};
    };

    KeyPushReleaseHandler.prototype.remove = function (keyCode) {
        delete this.keys[keyCode];
    };

    KeyPushReleaseHandler.prototype.keyDown = function (event) {
        Object.keys(this.keys).forEach(function (key) {
            if (event.keyCode == key && !this.activeKeys[key]) {
                this.activeKeys[key] = true;
                this.keys[key].push();
            }
        }, this);
    };

    KeyPushReleaseHandler.prototype.keyUp = function (event) {
        Object.keys(this.keys).forEach(function (key) {
            if (event.keyCode == key) {
                delete this.activeKeys[key];
                this.keys[key].release();
            }
        }, this);
    };

    return KeyPushReleaseHandler;
})(Object);