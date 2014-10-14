var KeyHandler = (function () {
    "use strict";

    function KeyHandler() {
        this.keys = {};
    }

    KeyHandler.prototype.add = function (keyCode, callback) {
        this.keys[keyCode] = callback;
    };

    KeyHandler.prototype.remove = function (keyCode) {
        delete this.keys[keyCode];
    };

    KeyHandler.prototype.keyDown = function (event) {
        for (var key in this.keys) {
            if (event.keyCode == key) {
                this.keys[key]();
            }
        }
    };

    return KeyHandler;
})();