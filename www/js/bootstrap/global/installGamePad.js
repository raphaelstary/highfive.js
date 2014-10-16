var installGamePad = (function (window, GamePadHandler) {
    "use strict";

    function installGamePad() {
        var gamePadHandler = new GamePadHandler();

        window.addEventListener('gamepadconnected', gamePadHandler.connect.bind(gamePadHandler));
        window.addEventListener('gamepaddisconnected', gamePadHandler.disconnect.bind(gamePadHandler));

        return gamePadHandler;
    }

    return installGamePad;
})(window, GamePadHandler);