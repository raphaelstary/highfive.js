H5.installKeyBoard = (function (window, KeyHandler, Event, EdgeKeyHandler) {
    'use strict';

    function installKeyBoard(events, device) {
        var keyHandler = device.isEdge ? new EdgeKeyHandler(events) : new KeyHandler(events);

        function keyDown(event) {
            keyHandler.keyDown(event);
        }

        function keyUp(event) {
            keyHandler.keyUp(event);
        }

        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        events.subscribe(Event.TICK_INPUT, keyHandler.update.bind(keyHandler));

        function removeEventListener() {
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
        }

        return removeEventListener;
    }

    return installKeyBoard;
})(window, H5.KeyHandler, H5.Event, H5.EdgeKeyHandler);