var bootstrapKeyBoardAndGamePad = (function (installCanvas, installKeyBoard, installGamePad, installKeyPushRelease, App) {
    "use strict";

    function bootstrapKeyBoardAndGamePad() {
        var screen = installCanvas();
        var keyBoard = installKeyBoard();
        var gamePad = installGamePad();
        var keyPushRelease = installKeyPushRelease();

        var gameServices = {
            screen: screen,
            keyBoard: keyBoard,
            gamePad: gamePad,
            keyPushRelease: keyPushRelease
        };

        return new App(gameServices);
    }

    return bootstrapKeyBoardAndGamePad;
})(installCanvas, installKeyBoard, installGamePad, installKeyPushRelease, App);