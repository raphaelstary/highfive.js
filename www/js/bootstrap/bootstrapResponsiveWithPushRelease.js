var bootstrapResponsiveWithPushRelease = (function (installCanvas, installResize, installTap, installPushRelease, App) {
    "use strict";

    function bootstrapResponsiveWithPushRelease() {
        var screen = installCanvas();
        var resize = installResize();
        var tap = installTap(screen);
        var dragNDrop = installPushRelease(screen);

        return new App(screen, resize, tap, dragNDrop);
    }

    return bootstrapResponsiveWithPushRelease;
})(installCanvas, installResize, installTap, installPushRelease, App);