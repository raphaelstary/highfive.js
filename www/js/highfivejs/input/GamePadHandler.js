H5.GamePadHandler = (function (GamePad, Event, getGamepads) {
    'use strict';

    function GamePadHandler(events) {
        this.events = events;
        this.gamePads = [];
    }

    GamePadHandler.prototype.connect = function (event) {
        this.gamePads.push(new GamePad(event.gamepad.index));
    };

    //todo rework
    GamePadHandler.prototype.detect = function () {
        var pads = getGamepads();

        for (var i = 0; i < pads.length; i++) {
            var probablePad = pads[i];
            if (!probablePad) {
                continue;
            }

            this.gamePads.push(new GamePad(probablePad.index));
        }
    };

    GamePadHandler.prototype.shouldDetect = function () {
        //todo rework
        return this.gamePads.length < 1;
    };

    GamePadHandler.prototype.disconnect = function (event) {

    };

    GamePadHandler.prototype.update = function () {
        // todo rework
        if (this.shouldDetect()) {
            this.detect();
        }

        var self = this;
        this.gamePads.forEach(function (gamePad) {
            if (gamePad.update()) {
                self.events.fireSync(Event.GAME_PAD, gamePad);
            }
        });
    };

    return GamePadHandler;

})(H5.GamePad, H5.Event, H5.getGamepads);