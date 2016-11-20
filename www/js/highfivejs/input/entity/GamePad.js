H5.GamePad = (function (navigator, Button, Axis) {
    "use strict";

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
        return this.isPressed(Button.RIGHT_TRIGGER);
    };

    GamePad.prototype.isAPressed = function () {
        return this.isPressed(Button.A);
    };

    GamePad.prototype.isBPressed = function () {
        return this.isPressed(Button.B);
    };

    GamePad.prototype.isXPressed = function () {
        return this.isPressed(Button.X);
    };

    GamePad.prototype.isYPressed = function () {
        return this.isPressed(Button.Y);
    };

    GamePad.prototype.isRightBumperPressed = function () {
        return this.isPressed(Button.RIGHT_BUMPER);
    };

    GamePad.prototype.isLeftBumperPressed = function () {
        return this.isPressed(Button.LEFT_BUMPER);
    };

    GamePad.prototype.isStartPressed = function () {
        return this.isPressed(Button.START);
    };

    GamePad.prototype.isDPadUpPressed = function () {
        return this.isPressed(Button.D_PAD_UP);
    };

    GamePad.prototype.isDPadRightPressed = function () {
        return this.isPressed(Button.D_PAD_RIGHT);
    };

    GamePad.prototype.isDPadDownPressed = function () {
        return this.isPressed(Button.D_PAD_DOWN);
    };

    GamePad.prototype.isDPadLeftPressed = function () {
        return this.isPressed(Button.D_PAD_LEFT);
    };

    GamePad.prototype.isPressed = function (button) {
        return this.buttons[button].pressed;
    };

    return GamePad;
})(navigator, H5.GamePadButton, H5.GamePadAxis);