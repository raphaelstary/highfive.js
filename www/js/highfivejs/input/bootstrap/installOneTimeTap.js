H5.installOneTimeTap = (function (window) {
    "use strict";

    function installOneTimeTap(element, callback) {
        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', handleClick);
        }

        element.addEventListener('click', handleClick);
        function handleClick(event) {
            event.preventDefault();

            if ('ontouchstart' in window) {
                element.removeEventListener('touchstart', handleClick);
            }

            element.removeEventListener('click', handleClick);

            callback(event);
        }
    }

    return installOneTimeTap;
})(window);