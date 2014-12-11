var installTap = (function (window, TapHandler) {
    "use strict";

    function installTap(element) {
        var tapHandler = new TapHandler();

        if (window.PointerEvent) {
            element.addEventListener('pointerdown', tapHandler.click.bind(tapHandler));

        } else if (window.MSPointerEvent) {
            element.addEventListener('MSPointerDown', tapHandler.click.bind(tapHandler));

        } else {
            if ('ontouchstart' in window) {
                element.addEventListener('touchstart', tapHandler.touchStart.bind(tapHandler));
            }

            element.addEventListener('click', tapHandler.click.bind(tapHandler));
        }

        return tapHandler;
    }

    return installTap;
})(window, TapHandler);