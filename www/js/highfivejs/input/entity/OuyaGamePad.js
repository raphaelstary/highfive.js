H5.OuyaGamePad = (function () {
    "use strict";

    function OuyaGamePad(index) {
        this.index = index;
        this.buttons = initButtons();
        this.axes = initAxes();
        this.changed = false;
    }

    OuyaGamePad.prototype.getLeftStickXAxis = function () {
        return this.axes.LS_X;
    };

    OuyaGamePad.prototype.getLeftStickYAxis = function () {
        return this.axes.LS_Y;
    };

    OuyaGamePad.prototype.getRightStickXAxis = function () {
        return this.axes.RS_X;
    };

    OuyaGamePad.prototype.getRightStickYAxis = function () {
        return this.axes.RS_Y;
    };

    OuyaGamePad.prototype.getRightTrigger = function () {
        return this.axes.R2;
    };

    OuyaGamePad.prototype.isAPressed = function () {
        return this.buttons.O;
    };

    OuyaGamePad.prototype.isBPressed = function () {
        return this.buttons.A;
    };

    function initButtons() {
        return {
            O: false,
            U: false,
            Y: false,
            A: false,
            L1: false,
            R1: false,
            L3: false,
            R3: false,
            D_PAD_UP: false,
            D_PAD_DOWN: false,
            D_PAD_RIGHT: false,
            D_PAD_LEFT: false,
            MENU: false
        };
    }

    function initAxes() {
        return {
            LS_X: 0,
            LS_Y: 0,
            RS_X: 0,
            RS_Y: 0,
            L2: 0,
            R2: 0
        };
    }

    return OuyaGamePad;
})();