var installPushRelease = (function (window, PushReleaseHandler) {
    "use strict";

    function installPushRelease(canvas) {
        var pushRelease = new PushReleaseHandler();

        if(window.PointerEvent) {

            canvas.addEventListener('pointerdown', pushRelease.mouseDown.bind(pushRelease));
            canvas.addEventListener('pointerup', pushRelease.mouseUp.bind(pushRelease));

        } else if (window.MSPointerEvent) {

            canvas.addEventListener('MSPointerDown', pushRelease.mouseDown.bind(pushRelease));
            canvas.addEventListener('MSPointerUp', pushRelease.mouseUp.bind(pushRelease));

        } else {
            if ('ontouchstart' in window) {

                canvas.addEventListener('touchstart', pushRelease.touchStart.bind(pushRelease));
                canvas.addEventListener('touchend', pushRelease.touchEnd.bind(pushRelease));
            }
            canvas.addEventListener('mousedown', pushRelease.mouseDown.bind(pushRelease));
            canvas.addEventListener('mouseup', pushRelease.mouseUp.bind(pushRelease));
        }

        return pushRelease;
    }

    return installPushRelease;
})(window, PushReleaseHandler);