H5.installFullScreen = (function (document, FullScreenController, FullScreenHandler) {
    "use strict";

    function installFullScreen(screenElement, events) {
        var controller = new FullScreenController(screenElement);
        var handler = new FullScreenHandler(controller, events);
        if (controller.isSupported) {
            document.addEventListener("fullscreenchange", handler.change.bind(handler));
            document.addEventListener("webkitfullscreenchange", handler.change.bind(handler));
            document.addEventListener("mozfullscreenchange", handler.change.bind(handler));
            document.addEventListener("MSFullscreenChange", handler.change.bind(handler));
        }

        return controller;
    }

    return installFullScreen;
})(window.document, H5.FullScreenController, H5.FullScreenHandler);