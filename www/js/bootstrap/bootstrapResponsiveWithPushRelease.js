var bootstrapResponsiveWithPushRelease = (function (installCanvas, installResize, installTap, installPushRelease, App) {
    "use strict";

    function bootstrapResponsiveWithPushRelease() {
        var screen = installCanvas();
        var resize = installResize();
        var tap = installTap(screen);
        var pushRelease = installPushRelease(screen);

        var gameServices = {
            screen: screen,
            resize: resize,
            tap: tap,
            pushRelease: pushRelease
        };

        return new App(gameServices);
    }

    return bootstrapResponsiveWithPushRelease;
})(installCanvas, installResize, installTap, installPushRelease, App);