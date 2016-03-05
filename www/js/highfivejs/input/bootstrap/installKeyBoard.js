H5.installKeyBoard = (function (window, KeyHandler, Event) {
    "use strict";

    function installKeyBoard(events) {
        var keyHandler = new KeyHandler(events);
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
})(window, H5.KeyHandler, H5.Event);