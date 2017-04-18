H5.installWheel = (function (window, Event, WheelHandler) {
    'use strict';

    function installKeyBoard(events) {
        var wheelHandler = new WheelHandler(events);

        function wheel(event) {
            wheelHandler.rotation(event);
        }

        window.addEventListener('wheel', wheel);

        events.subscribe(Event.TICK_INPUT, wheelHandler.update.bind(wheelHandler));

        function removeEventListener() {
            window.removeEventListener('wheel', wheel);
        }

        return removeEventListener;
    }

    return installKeyBoard;
})(window, H5.Event, H5.WheelHandler);