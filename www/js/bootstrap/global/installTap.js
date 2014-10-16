var installTap = (function (window, TapHandler) {
    "use strict";

    function installTap(canvas) {
        var tapHandler = new TapHandler();

        if (window.PointerEvent) {
            canvas.addEventListener('pointerdown', tapHandler.click.bind(tapHandler));

        } else if (window.MSPointerEvent) {
            canvas.addEventListener('MSPointerDown', tapHandler.click.bind(tapHandler));

        } else {
            if ('ontouchstart' in window) {
                canvas.addEventListener('touchstart', tapHandler.touchStart.bind(tapHandler));
            }

            canvas.addEventListener('click', tapHandler.click.bind(tapHandler));
        }

        return tapHandler;
    }

    return installTap;
})(window, TapHandler);