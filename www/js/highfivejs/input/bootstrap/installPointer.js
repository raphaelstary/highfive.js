H5.installPointer = (function (PointerHandler, Event, window) {
    "use strict";

    function installPointer(events, device, canvas) {
        var pointerHandler = new PointerHandler(events, device);

        if (device.isWin7 && device.isIE10) {
            if ('ontouchstart' in window) {
                canvas.addEventListener('touchstart', pointerHandler.touchStart.bind(pointerHandler));
                canvas.addEventListener('touchmove', pointerHandler.touchMove.bind(pointerHandler));
                canvas.addEventListener('touchend', pointerHandler.touchEnd.bind(pointerHandler));
                canvas.addEventListener('touchcancel', pointerHandler.touchCancel.bind(pointerHandler));
            }
            canvas.addEventListener('mousedown', pointerHandler.mouseDown.bind(pointerHandler));
            canvas.addEventListener('mousemove', pointerHandler.mouseMove.bind(pointerHandler));
            canvas.addEventListener('mouseup', pointerHandler.mouseUp.bind(pointerHandler));
            canvas.addEventListener('mouseout', pointerHandler.mouseCancel.bind(pointerHandler));

        } else if (window.PointerEvent) {

            canvas.addEventListener('pointerdown', pointerHandler.pointerDown.bind(pointerHandler));
            canvas.addEventListener('pointermove', pointerHandler.pointerMove.bind(pointerHandler));
            canvas.addEventListener('pointerup', pointerHandler.pointerUp.bind(pointerHandler));
            canvas.addEventListener('pointerout', pointerHandler.pointerCancel.bind(pointerHandler));

        } else if (window.MSPointerEvent) {

            canvas.addEventListener('MSPointerDown', pointerHandler.pointerDown.bind(pointerHandler));
            canvas.addEventListener('MSPointerMove', pointerHandler.pointerMove.bind(pointerHandler));
            canvas.addEventListener('MSPointerUp', pointerHandler.pointerUp.bind(pointerHandler));
            canvas.addEventListener('MSPointerOut', pointerHandler.pointerCancel.bind(pointerHandler));

        } else {
            if ('ontouchstart' in window) {

                canvas.addEventListener('touchstart', pointerHandler.touchStart.bind(pointerHandler));
                canvas.addEventListener('touchmove', pointerHandler.touchMove.bind(pointerHandler));
                canvas.addEventListener('touchend', pointerHandler.touchEnd.bind(pointerHandler));
                canvas.addEventListener('touchcancel', pointerHandler.touchCancel.bind(pointerHandler));
            }
            canvas.addEventListener('mousedown', pointerHandler.mouseDown.bind(pointerHandler));
            canvas.addEventListener('mousemove', pointerHandler.mouseMove.bind(pointerHandler));
            canvas.addEventListener('mouseup', pointerHandler.mouseUp.bind(pointerHandler));
            canvas.addEventListener('mouseout', pointerHandler.mouseCancel.bind(pointerHandler));
        }

        events.subscribe(Event.TICK_INPUT, pointerHandler.update.bind(pointerHandler));

        return pointerHandler;
    }

    return installPointer;
})(H5.PointerHandler, H5.Event, window);