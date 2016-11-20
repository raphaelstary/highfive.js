H5.KeyHandler = (function (Event) {
    "use strict";

    function KeyHandler(events) {
        this.events = events;
        this.pressedKeys = {
            isPressed: function (code) {
                return this[code];
            }
        };
        this.changed = false;
    }

    KeyHandler.prototype.keyDown = function (event) {
        if (event.keyCode != 17 && event.keyCode != 82 && event.keyCode != 123)
            event.preventDefault();
        this.pressedKeys[event.keyCode] = true;
        this.changed = true;
    };

    KeyHandler.prototype.keyUp = function (event) {
        event.preventDefault();
        delete this.pressedKeys[event.keyCode];
        this.changed = true;
    };

    KeyHandler.prototype.update = function () {
        if (this.changed) {
            this.events.fireSync(Event.KEY_BOARD, this.pressedKeys);
            this.changed = false;
        }
    };

    return KeyHandler;
})(H5.Event);