var GamePad = (function (navigator) {
    "use strict";

    var Button = {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,
        LEFT_BUMPER: 4,
        RIGHT_BUMPER: 5,
        BACK: 6,
        START: 7,
        GUIDE: 8,
        LEFT_STICK: 9,
        RIGHT_STICK: 10,
        D_PAD_LEFT: 11,
        D_PAD_RIGHT: 12,
        D_PAD_UP: 13,
        D_PAD_DOWN: 14
    };

    var Axis = {
        LEFT_STICK_X: 0,
        LEFT_STICK_Y: 1,
        LEFT_TRIGGER: 2,
        RIGHT_STICK_X: 3,
        RIGHT_STICK_Y: 4,
        RIGHT_TRIGGER: 5
    };

    function GamePad(index) {
        this.index = index;
        this.lastUpdate = 0;
    }

    GamePad.prototype.update = function () {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() :
            (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        var pad = gamepads[this.index];

        if (pad.timestamp > this.lastUpdate) {
            this.buttons = pad.buttons;
            this.axes = pad.axes;
            this.lastUpdate = pad.timestamp;

            return true;
        }
        return false;
    };

    GamePad.prototype.getLeftStickXAxis = function () {
        return this.axes[Axis.LEFT_STICK_X];
    };

    GamePad.prototype.getLeftStickYAxis = function () {
        return this.axes[Axis.LEFT_STICK_Y];
    };

    GamePad.prototype.getRightStickXAxis = function () {
        return this.axes[Axis.RIGHT_STICK_X];
    };

    GamePad.prototype.getRightStickYAxis = function () {
        return this.axes[Axis.RIGHT_STICK_Y];
    };

    GamePad.prototype.getRightTrigger = function () {
        return this.axes[Axis.RIGHT_TRIGGER];
    };

    GamePad.prototype.isAPressed = function () {
        return this._isButtonPressed(Button.A);
    };

    GamePad.prototype.isBPressed = function () {
        return this._isButtonPressed(Button.B);
    };

    GamePad.prototype.isRightBumperPressed = function () {
        return this._isButtonPressed(Button.RIGHT_BUMPER);
    };

    GamePad.prototype.isLeftBumperPressed = function () {
        return this._isButtonPressed(Button.LEFT_BUMPER);
    };

    GamePad.prototype._isButtonPressed = function (button) {
        return this.buttons[button].pressed;
    };

    return GamePad;
})(navigator);