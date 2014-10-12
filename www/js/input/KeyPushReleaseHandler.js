var KeyPushReleaseHandler = (function () {
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
        for (var key in this.keys) {
            if (event.keyCode == key && !this.activeKeys[key]) {
                this.activeKeys[key] = true;
                this.keys[key].push();
            }
        }
    };

    KeyPushReleaseHandler.prototype.keyUp = function (event) {
        for (var key in this.keys) {
            if (event.keyCode == key) {
                delete this.activeKeys[key];
                this.keys[key].release();
            }
        }
    };

    return KeyPushReleaseHandler;
})();