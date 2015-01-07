var KeyHandler = (function (Event) {
    "use strict";

    function KeyHandler(events) {
        this.events = events;
        this.pressedKeys = {};
        this.changed = false;
    }

    KeyHandler.prototype.keyDown = function (event) {
        this.pressedKeys[event.keyCode] = true;
        this.changed = true;
    };

    KeyHandler.prototype.keyUp = function (event) {
        delete this.pressedKeys[event.keyCode];
        this.changed = true;
    };

    KeyHandler.prototype.update = function () {
        if (this.changed) {
            this.events.syncFire(Event.KEY_BOARD, this.pressedKeys);
            this.changed = false;
        }
    };

    return KeyHandler;
})(Event);