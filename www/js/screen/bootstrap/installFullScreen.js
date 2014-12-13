var installFullScreen = (function (document, FullScreenBus, FullScreenController, FullScreenHandler) {
    "use strict";

    function installFullScreen(screenElement) {
        var bus = new FullScreenBus();
        var controller = new FullScreenController(screenElement, bus);
        var handler = new FullScreenHandler(controller, bus);
        if (controller.isSupported) {
            document.addEventListener("fullscreenchange", handler.change.bind(handler));
            document.addEventListener("webkitfullscreenchange", handler.change.bind(handler));
            document.addEventListener("mozfullscreenchange", handler.change.bind(handler));
            document.addEventListener("MSFullscreenChange", handler.change.bind(handler));
        }

        return controller;
    }

    return installFullScreen;
})(window.document, FullScreenBus, FullScreenController, FullScreenHandler);