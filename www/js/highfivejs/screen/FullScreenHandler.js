H5.FullScreenHandler = (function (Event) {
    "use strict";

    function FullScreenHandler(controller, events) {
        this.controller = controller;
        this.events = events;
    }

    FullScreenHandler.prototype.change = function () {
        this.events.fire(Event.FULL_SCREEN, this.controller.isFullScreen());
    };

    return FullScreenHandler;
})(H5.Event);