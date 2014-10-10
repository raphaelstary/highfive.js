var bootstrapResponsiveWithDragAndDrop = (function (installCanvas, installResize, installTap, installDragNDrop, App) {
    "use strict";

    function bootstrapResponsiveWithDragAndDrop() {
        var screen = installCanvas();
        var resize = installResize();
        var tap = installTap(screen);
        var dragNDrop = installDragNDrop(screen);

        var gameServices = {
            screen: screen,
            resize: resize,
            tap: tap,
            dragNDrop: dragNDrop
        };
        return new App(gameServices);
    }

    return bootstrapResponsiveWithDragAndDrop;
})(installCanvas, installResize, installTap, installDragNDrop, App);