H5.EdgeKeyHandler = (function (Event, Date, Object) {
    'use strict';

    var Type = {
        UP: 'up',
        DOWN: 'down'
    };

    function Keyboard(pressedKeys) {
        this.dict = {};

        Object.keys(pressedKeys).forEach(function (property) {
            this.dict[property] = pressedKeys[property].action == Type.UP;
        }, this);
    }

    Keyboard.prototype.isPressed = function (code) {
        return this.dict[code];
    };

    function KeyEvent(code, action, time) {
        this.code = code;
        this.action = action;
        this.time = time;
    }

    function EdgeKeyHandler(events) {
        this.events = events;

        this.currentKeys = {};

        this.lastUpdate = 0;
        this.lastChange = 0;

        this.pendingEvents = [];
    }

    EdgeKeyHandler.prototype.keyDown = function (event) {
        this.__triggerEvent(Type.DOWN, event);
    };

    EdgeKeyHandler.prototype.keyUp = function (event) {
        this.__triggerEvent(Type.UP, event);
    };

    EdgeKeyHandler.prototype.__triggerEvent = function (type, event) {
        event.preventDefault();

        this.lastChange = Date.now();
        var last = this.currentKeys[event.keyCode];
        if (last && last.type != type && last.time > this.lastUpdate) {
            this.pendingEvents.push(new KeyEvent(event.keyCode, type, this.lastChange));
        } else {
            this.currentKeys[event.keyCode] = new KeyEvent(event.keyCode, type, this.lastChange);
        }
    };

    EdgeKeyHandler.prototype.update = function () {
        if (this.lastChange > this.lastUpdate) {
            this.lastUpdate = this.lastChange;

            this.events.fireSync(Event.KEY_BOARD, new Keyboard(this.currentKeys));

            while (this.pendingEvents.length > 0) {
                var delayedEvent = this.pendingEvents.pop();
                this.lastChange = delayedEvent.time = this.lastUpdate + 1;
                this.currentKeys[delayedEvent.code] = delayedEvent;
            }
        }
    };

    return EdgeKeyHandler;
})(H5.Event, Date, Object);