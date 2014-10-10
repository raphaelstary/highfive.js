var bootstrapKeyBoardAndGamePad = (function (installCanvas, installKeyBoard, installGamePad, App) {
    "use strict";

    function bootstrapKeyBoardAndGamePad() {
        var screen = installCanvas();
        var keyBoard = installKeyBoard();
        var gamePad = installGamePad();

        var gameServices = {
            screen: screen,
            keyBoard: keyBoard,
            gamePad: gamePad
        };

        return new App(gameServices);
    }

    return bootstrapKeyBoardAndGamePad;
})(installCanvas, installKeyBoard, installGamePad, App);