var KeyHandler = (function (Object) {
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
        Object.keys(this.keys).forEach(function (key) {
            if (event.keyCode == key)
                this.keys[key]();
        }, this);
    };

    return KeyHandler;
})(Object);