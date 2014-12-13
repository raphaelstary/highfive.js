var installOrientation = (function (window, screen, OrientationBus, OrientationHandler) {
    "use strict";

    function installOrientation() {
        var bus = new OrientationBus();
        var handler = new OrientationHandler(bus);

        if ('orientation' in screen && 'angle' in screen.orientation) {
            handler.orientationType();
            screen.orientation.addEventListener('change', handler.orientationType.bind(handler));

        } else if (screen.orientation || screen.mozOrientation || screen.msOrientation) {
            handler.screenOrientation();
            screen.addEventListener("orientationchange", handler.screenOrientation.bind(handler));
            screen.addEventListener("MSOrientationChange", handler.screenOrientation.bind(handler));
            screen.addEventListener("mozorientationchange", handler.screenOrientation.bind(handler));

        } else if (window.orientation) {
            handler.windowOrientation();
            window.addEventListener("orientationchange", handler.windowOrientation.bind(handler));

        } else {
            handler.handleResize();
            window.addEventListener("resize", handler.handleResize.bind(handler));
        }
        bus.orientation = handler.lastOrientation;

        return bus;
    }

    return installOrientation;
})(window, window.screen, OrientationBus, OrientationHandler);