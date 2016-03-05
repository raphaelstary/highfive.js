H5.OuyaGamePadHandler = (function (OuyaGamePad, Event, Object) {
    "use strict";

    function OuyaGamePadHandler(events) {
        this.events = events;
        this.gamePads = {
            0: new OuyaGamePad(0),
            1: new OuyaGamePad(1),
            2: new OuyaGamePad(2),
            3: new OuyaGamePad(3)
        };
        this.changed = false;
    }

    OuyaGamePadHandler.prototype.update = function () {
        if (this.changed) {
            Object.keys(this.gamePads).forEach(function (gamePad) {
                if (gamePad.changed) {
                    this.events.fireSync(Event.GAME_PAD, gamePad);
                    gamePad.changed = false;
                }
            }, this);
            this.changed = false;
        }
    };

    OuyaGamePadHandler.prototype.keyDown = function (playerNumber, button) {
        updateButton(this.gamePads[playerNumber], button, true);
        this.changed = true;
    };

    OuyaGamePadHandler.prototype.keyUp = function (playerNumber, button) {
        updateButton(this.gamePads[playerNumber], button, false);
        this.changed = true;
    };

    OuyaGamePadHandler.prototype.genericMotionEvent = function (playerNumber, axis, value) {
        var gamePad = this.gamePads[playerNumber];

        gamePad.changed = true;

        switch (axis) {
            case Axis.LS_X:
                gamePad.axes.LS_X = value;
                break;
            case Axis.LS_Y:
                gamePad.axes.LS_Y = value;
                break;
            case Axis.RS_X:
                gamePad.axes.RS_X = value;
                break;
            case Axis.RS_Y:
                gamePad.axes.RS_Y = value;
                break;
            case Axis.L2:
                gamePad.axes.L2 = value;
                break;
            case Axis.R2:
                gamePad.axes.R2 = value;
                break;
        }
        this.changed = true;
    };

    function updateButton(gamePad, button, pressed) {
        gamePad.changed = true;
        switch (button) {
            case Button.O:
                gamePad.buttons.O = pressed;
                break;
            case Button.U:
                gamePad.buttons.U = pressed;
                break;
            case Button.Y:
                gamePad.buttons.Y = pressed;
                break;
            case Button.A:
                gamePad.buttons.A = pressed;
                break;
            case Button.L1:
                gamePad.buttons.L1 = pressed;
                break;
            case Button.R1:
                gamePad.buttons.R1 = pressed;
                break;
            case Button.L3:
                gamePad.buttons.L3 = pressed;
                break;
            case Button.R3:
                gamePad.buttons.R3 = pressed;
                break;
            case Button.DPAD_UP:
                gamePad.buttons.DPAD_UP = pressed;
                break;
            case Button.DPAD_DOWN:
                gamePad.buttons.DPAD_DOWN = pressed;
                break;
            case Button.DPAD_RIGHT:
                gamePad.buttons.DPAD_RIGHT = pressed;
                break;
            case Button.DPAD_LEFT:
                gamePad.buttons.DPAD_LEFT = pressed;
                break;
            case Button.MENU:
                gamePad.buttons.MENU = pressed;
                break;
        }
    }

    var Axis = {
        LS_X: 0,
        LS_Y: 1,
        RS_X: 11,
        RS_Y: 14,
        L2: 17,
        R2: 18
    };

    var Button = {
        O: 96,
        U: 99,
        Y: 100,
        A: 97,
        L1: 102,
        R1: 103,
        L3: 106,
        R3: 107,
        DPAD_UP: 19,
        DPAD_DOWN: 20,
        DPAD_RIGHT: 22,
        DPAD_LEFT: 21,
        MENU: 82
    };

    return OuyaGamePadHandler;
})(H5.OuyaGamePad, H5.Event, H5.Object);