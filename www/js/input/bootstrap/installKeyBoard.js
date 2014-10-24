var installKeyBoard = (function (window, KeyHandler) {
    "use strict";

    function installKeyBoard() {
        var keyHandler = new KeyHandler();
        window.addEventListener('keydown', keyHandler.keyDown.bind(keyHandler));

        return keyHandler;
    }

    return installKeyBoard;
})(window, KeyHandler);