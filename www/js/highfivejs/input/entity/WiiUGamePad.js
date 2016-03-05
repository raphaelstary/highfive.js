H5.WiiUGamePad = (function () {
    "use strict";

    function WiiUGamePad(gamepad, state) {
        this.gamepad = gamepad;
        this.state = state;
    }

    WiiUGamePad.prototype.update = function () {
        this.state = this.gamepad.update();
        return this.state.isEnabled == 1 && this.state.isDataValid == 1;
    };

    WiiUGamePad.prototype.__isButtonPressed = function (flag) {
        return (this.state.hold & flag) ? true : false;
    };

    WiiUGamePad.prototype.isAPressed = function () {
        return this.__isButtonPressed(WiiUButton.A);
    };

    var WiiUButton = {
        CONTROL_PAD_UP: 0x00000200,
        CONTROL_PAD_DOWN: 0x00000100,
        CONTROL_PAD_LEFT: 0x00000800,
        CONTROL_PAD_RIGHT: 0x00000400,
        A: 0x00008000,
        B: 0x00004000,
        X: 0x00002000,
        Y: 0x00001000,
        L: 0x00000020,
        R: 0x00000010,
        ZL: 0x00000080,
        ZR: 0x00000040,
        MINUS: 0x00000004,
        PLUS: 0x00000008,
        L_STICK_UP: 0x10000000,
        L_STICK_DOWN: 0x08000000,
        L_STICK_LEFT: 0x40000000,
        L_STICK_RIGHT: 0x20000000,
        R_STICK_UP: 0x01000000,
        R_STICK_DOWN: 0x00800000,
        R_STICK_LEFT: 0x04000000,
        R_STICK_RIGHT: 0x02000000,
        L_STICK: 0x00040000,
        R_STICK: 0x00020000
    };

    return WiiUGamePad;
})();