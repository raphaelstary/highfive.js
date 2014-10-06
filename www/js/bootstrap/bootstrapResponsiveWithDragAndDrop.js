var bootstrapResponsiveWithDragAndDrop = (function (installCanvas, installResize, installTap, installDragNDrop, App) {
    "use strict";

    function bootstrapResponsiveWithDragAndDrop() {
        var screen = installCanvas();
        var resize = installResize();
        var tap = installTap(screen);
        var dragNDrop = installDragNDrop(screen);

        return new App(screen, resize, tap, dragNDrop);
    }

    return bootstrapResponsiveWithDragAndDrop;
})(installCanvas, installResize, installTap, installDragNDrop, App);