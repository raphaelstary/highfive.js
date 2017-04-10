H5.WheelHandler = (function (Event) {
    'use strict';

    function WheelHandler(events) {
        this.events = events;

        this.__changed = false;
        this.__current = null;
    }

    WheelHandler.prototype.rotation = function (event) {
        event.preventDefault();

        this.__current = event;
        this.__changed = true;
    };

    WheelHandler.prototype.update = function () {
        if (this.__changed) {
            this.events.fireSync(Event.WHEEL, this.__current);
            this.__changed = false;
        }
    };

    return WheelHandler;
})(H5.Event);