var installGamePad = (function (window, GamePadHandler, Event, WiiUGamePadHandler, WiiUGamePad, WiiURemote, isOuya,
    OuyaGamePadHandler) {
    "use strict";

    function installGamePad(events) {
        if ('wiiu' in window) {
            var gamePad = window.wiiu.gamepad;
            var remote = window.wiiu.remote;
            var wiiuHandler = new WiiUGamePadHandler(events, new WiiUGamePad(gamePad, gamePad.update()));
            events.subscribe(Event.TICK_INPUT, wiiuHandler.update.bind(wiiuHandler));

        } else if (isOuya) {
            var ouyaHandler = new OuyaGamePadHandler(events);
            window.onGenericMotionEvent = ouyaHandler.genericMotionEvent.bind(ouyaHandler);
            window.onKeyDown = ouyaHandler.keyDown.bind(ouyaHandler);
            window.onKeyUp = ouyaHandler.keyUp.bind(ouyaHandler);
            events.subscribe(Event.TICK_INPUT, ouyaHandler.update.bind(ouyaHandler));

        } else {
            var gamePadHandler = new GamePadHandler(events);

            window.addEventListener('gamepadconnected', gamePadHandler.connect.bind(gamePadHandler));
            window.addEventListener('gamepaddisconnected', gamePadHandler.disconnect.bind(gamePadHandler));

            events.subscribe(Event.TICK_INPUT, gamePadHandler.update.bind(gamePadHandler));
        }
    }

    return installGamePad;
})(window, GamePadHandler, Event, WiiUGamePadHandler, WiiUGamePad, WiiURemote, false, OuyaGamePadHandler);