var bootstrapResponsiveWithPushRelease = (function (installCanvas, installResize, installTap, installPushRelease, App) {
    "use strict";

    function bootstrapResponsiveWithPushRelease() {
        var screen = installCanvas();
        var resize = installResize();
        var tap = installTap(screen);
        var pushRelease = installPushRelease(screen);

        return new App(screen, resize, tap, pushRelease);
    }

    return bootstrapResponsiveWithPushRelease;
})(installCanvas, installResize, installTap, installPushRelease, App);