var installOneTimeTap = (function (window) {
    "use strict";

    function installOneTimeTap(element, callback) {
        if (window.PointerEvent) {
            element.addEventListener('pointerdown', handleClick);

        } else if (window.MSPointerEvent) {
            element.addEventListener('MSPointerDown', handleClick);

        } else {
            if ('ontouchstart' in window) {
                element.addEventListener('touchstart', handleClick);
            }

            element.addEventListener('click', handleClick);
        }
        function handleClick(event) {
            event.preventDefault();

            if (window.PointerEvent) {
                element.removeEventListener('pointerdown', handleClick);

            } else if (window.MSPointerEvent) {
                element.removeEventListener('MSPointerDown', handleClick);

            } else {
                if ('ontouchstart' in window) {
                    element.removeEventListener('touchstart', handleClick);
                }

                element.removeEventListener('click', handleClick);
            }

            callback();
        }
    }

    return installOneTimeTap;
})(window);