var FullScreenHandler = (function () {
    "use strict";

    function FullScreenHandler(controller, bus) {
        this.controller = controller;
        this.bus = bus;
    }

    FullScreenHandler.prototype.change = function () {
        this.bus.changed(this.controller.isFullScreen());
    };

    return FullScreenHandler;
})();