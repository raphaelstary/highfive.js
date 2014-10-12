var installKeyPushRelease = (function (window, KeyPushReleaseHandler) {
    "use strict";

    function installKeyPushRelease() {
        var keyHandler = new KeyPushReleaseHandler();
        window.addEventListener('keydown', keyHandler.keyDown.bind(keyHandler));
        window.addEventListener('keyup', keyHandler.keyUp.bind(keyHandler));

        return keyHandler;
    }

    return installKeyPushRelease;
})(window, KeyPushReleaseHandler);