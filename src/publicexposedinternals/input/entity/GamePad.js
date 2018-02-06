H5.GamePad = (function (Button, Axis, Error) {
    'use strict';

    function GamePad(index) {
        this.index = index;
        this.lastUpdate = 0;
    }

    GamePad.prototype.update = function (gamepads) {
        var pad = gamepads[this.index];

        if (!pad) {
            // todo rework
            throw new Error('gamepad + ' + this.index + ' + not found');
        }

        if (pad.timestamp > this.lastUpdate) {
            this.buttons = pad.buttons;
            this.axes = pad.axes;
            this.lastUpdate = pad.timestamp;

            this.mapping = pad.mapping;
            this.connected = pad.connected;
            this.id = pad.id;

            this.profile = pad.profile; // non standard tvOS/iOS

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
        var btn = this.buttons[button];
        return btn && btn.pressed;
    };

    return GamePad;
})(H5.GamePadButton, H5.GamePadAxis, Error);
