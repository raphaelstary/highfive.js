H5.GamePad = (function (navigator) {
    "use strict";

    var Button = {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,
        LEFT_BUMPER: 4,
        RIGHT_BUMPER: 5,
        LEFT_TRIGGER: 6,
        RIGHT_TRIGGER: 7,
        BACK: 8,
        START: 9,
        LEFT_STICK: 10,
        RIGHT_STICK: 11,
        D_PAD_UP: 12,
        D_PAD_DOWN: 13,
        D_PAD_LEFT: 14,
        D_PAD_RIGHT: 15,
        GUIDE: 16
    };

    var Axis = {
        LEFT_STICK_X: 0,
        LEFT_STICK_Y: 1,
        RIGHT_STICK_X: 2,
        RIGHT_STICK_Y: 3
    };

    function GamePad(index) {
        this.index = index;
        this.lastUpdate = 0;
    }

    GamePad.prototype.update = function () {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() :
            (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        var pad = gamepads[this.index];

        if (!pad) {
            // todo fire exception
            return;
        }

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

    GamePad.prototype.isRightTriggerPressed = function () {
        return this.__isButtonPressed(Button.RIGHT_TRIGGER);
    };

    GamePad.prototype.isAPressed = function () {
        return this.__isButtonPressed(Button.A);
    };

    GamePad.prototype.isBPressed = function () {
        return this.__isButtonPressed(Button.B);
    };

    GamePad.prototype.isRightBumperPressed = function () {
        return this.__isButtonPressed(Button.RIGHT_BUMPER);
    };

    GamePad.prototype.isLeftBumperPressed = function () {
        return this.__isButtonPressed(Button.LEFT_BUMPER);
    };

    GamePad.prototype.isStartPressed = function () {
        return this.__isButtonPressed(Button.START);
    };

    GamePad.prototype.isDPadUpPressed = function () {
        return this.__isButtonPressed(Button.D_PAD_UP);
    };

    GamePad.prototype.isDPadRightPressed = function () {
        return this.__isButtonPressed(Button.D_PAD_RIGHT);
    };

    GamePad.prototype.isDPadDownPressed = function () {
        return this.__isButtonPressed(Button.D_PAD_DOWN);
    };

    GamePad.prototype.isDPadLeftPressed = function () {
        return this.__isButtonPressed(Button.D_PAD_LEFT);
    };

    GamePad.prototype.__isButtonPressed = function (button) {
        return this.buttons[button].pressed;
    };

    return GamePad;
})(navigator);