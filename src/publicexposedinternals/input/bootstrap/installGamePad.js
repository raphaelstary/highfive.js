H5.installGamePad = (function (window, GamePadHandler, Event) {
    'use strict';

    function installGamePad(events) {
        var gamePadHandler = new GamePadHandler(events);

        window.addEventListener('gamepadconnected', gamePadHandler.connect.bind(gamePadHandler));
        window.addEventListener('gamepaddisconnected', gamePadHandler.disconnect.bind(gamePadHandler));

        events.subscribe(Event.TICK_INPUT, gamePadHandler.update.bind(gamePadHandler));
    }

    return installGamePad;
})(window, H5.GamePadHandler, H5.Event);
