H5.installOrientation = (function (window, screen, OrientationHandler, Event) {
    "use strict";

    function installOrientation(events, device) {
        var handler = new OrientationHandler(events);

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
        device.orientation = handler.lastOrientation;

        events.subscribe(Event.SCREEN_ORIENTATION, function (orientation) {
            device.orientation = orientation;
        });
    }

    return installOrientation;
})(window, window.screen, H5.OrientationHandler, H5.Event);