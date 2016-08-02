H5.GamePadHandler = (function (GamePad, navigator, Event) {
    "use strict";

    function GamePadHandler(events) {
        this.events = events;
        this.gamePads = [];
    }

    GamePadHandler.prototype.connect = function (event) {
        this.gamePads.push(new GamePad(event.gamepad.index));
    };

    GamePadHandler.prototype.detect = function () {
        var pads = navigator.getGamepads ? navigator.getGamepads() :
            (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

        for (var i = 0; i < pads.length; i++) {
            var probablePad = pads[i];
            if (!probablePad)
                continue;

            this.gamePads.push(new GamePad(probablePad.index));
        }
    };

    GamePadHandler.prototype.shouldDetect = function () {
        return this.gamePads.length < 1;
    };

    GamePadHandler.prototype.disconnect = function (event) {

    };

    GamePadHandler.prototype.update = function () {
        if (this.shouldDetect())
            this.detect();

        var self = this;
        this.gamePads.forEach(function (gamePad) {
            if (gamePad.update())
                self.events.fireSync(Event.GAME_PAD, gamePad);
        });
    };

    return GamePadHandler;

})(H5.GamePad, navigator, H5.Event);