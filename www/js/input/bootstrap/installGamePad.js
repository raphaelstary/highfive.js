var installGamePad = (function (window, GamePadHandler, Event, WiiUGamePadHandler, WiiUGamePad, WiiURemote) {
    "use strict";

    function installGamePad(events) {
        if ('wiiu' in window) {
            var gamePad = window.wiiu.gamepad;
            var remote = window.wiiu.remote;
            var wiiuHandler = new WiiUGamePadHandler(events, new WiiUGamePad(gamePad, gamePad.update()));
            events.subscribe(Event.TICK_INPUT, wiiuHandler.update.bind(wiiuHandler));

        } else {
            var gamePadHandler = new GamePadHandler(events);

            window.addEventListener('gamepadconnected', gamePadHandler.connect.bind(gamePadHandler));
            window.addEventListener('gamepaddisconnected', gamePadHandler.disconnect.bind(gamePadHandler));

            events.subscribe(Event.TICK_INPUT, gamePadHandler.update.bind(gamePadHandler));
        }
    }

    return installGamePad;
})(window, GamePadHandler, Event, WiiUGamePadHandler, WiiUGamePad, WiiURemote);