H5.Buttons = (function () {
    'use strict';

    function Button(drawable, graphic, pressedGraphic) {
        this.drawable = drawable;
        this.graphic = graphic;
        this.pressedGraphic = pressedGraphic;

        this.selected = false;
        this.pressed = false;
        this.started = 0;

        this.down = null;
        this.up = null;
        this.cancel = null;

        this.hold = null;
    }

    // todo reintegrate with H5 -> maybe like PlayerControls for gamepad + keyboard
    //     ... maybe add everything to PlayerControls so all PlayerControls are in one place
    //     -> one API interface class like stage
    //
    // - add text button
    // - maybe add possibility to add extra touchable other than image with btns?
    // - add way to cancel press (possible solution with injected event: event.captured ... or maybe event.cancel()
    //     oooorr you can register a separate cancel / predicate callback with Buttons.getXYZ(a,b,predicate)
    // - maybe 'group' buttons into some kind of select list when only one selection is possible
    //     ... RECHECK solution used for monkey gang menu
    // - add check for 'up' event that active button is the hit button
    // - add event listener functions (like PlayerControls for gamepad + keyboard)
    //     -> therefore consolidate every 2nd screen scene class

    function getButton(stage, drawable, imgName, pressedImgName) {
        return new Button(drawable, stage.getGraphic(imgName), stage.getGraphic(pressedImgName));
    }

    function getDown(button, callback) {
        return function () {
            button.drawable.data = button.pressedGraphic;
            if (callback) {
                callback();
            }
        };
    }

    function getUp(button, callback) {
        return function () {
            button.drawable.data = button.graphic;
            if (callback) {
                callback();
            }
        };
    }

    function getCancel(button, callback) {
        return function () {
            button.drawable.data = button.graphic;
            if (callback) {
                callback();
            }
        };
    }

    function getToggleDown(button, callback) {
        return function () {
            button.drawable.data = button.selected ? button.graphic : button.pressedGraphic;
            if (callback) {
                callback();
            }
        };
    }

    function getToggleUp(button, callback) {
        return function () {
            button.selected = !button.selected;
            if (callback) {
                callback();
            }
        };
    }

    function getToggleCancel(button, callback) {
        return function () {
            button.drawable.data = button.selected ? button.pressedGraphic : button.graphic;
            if (callback) {
                callback();
            }
        };
    }

    return {
        get: getButton,
        getDownCallback: getDown,
        getUpCallback: getUp,
        getCancelCallback: getCancel,
        getToggleDownCallback: getToggleDown,
        getToggleUpCallback: getToggleUp,
        getToggleCancelCallback: getToggleCancel
    };
})();
