var installKeyBoard = (function (window, KeyHandler, Event) {
    "use strict";

    function installKeyBoard(events) {
        var keyHandler = new KeyHandler(events);
        window.addEventListener('keydown', keyHandler.keyDown.bind(keyHandler));
        window.addEventListener('keyup', keyHandler.keyUp.bind(keyHandler));
        events.subscribe(Event.TICK_INPUT, keyHandler.update.bind(keyHandler));

        return keyHandler;
    }

    return installKeyBoard;
})(window, KeyHandler, Event);