var GamePadHandler = (function (GamePad, getGamepads) {
    "use strict";

    function GamePadHandler() {
        this.gamePads = [];
    }

    GamePadHandler.prototype.connect = function (event) {
        var pad = event.gamepad;

        console.log('game pad connected');
        console.log(pad.index);

        this.gamePads.push(new GamePad(pad.index));
    };

    GamePadHandler.prototype.detect = function () {
        var pads = getGamepads();

        for (var i = 0; i < pads.length; i++) {
            var probablePad = pads[i];

            if (!probablePad)
                continue;

            console.log('game pad connected');
            console.log(probablePad.index);
            console.log(probablePad.timestamp);

            this.gamePads.push(new GamePad(probablePad.index));
        }
    };

    GamePadHandler.prototype.shouldDetect = function () {
        return this.gamePads.length < 1;
    };

    GamePadHandler.prototype.disconnect = function (event) {

    };

    GamePadHandler.prototype.iterateGamePads = function (callback) {
        this.gamePads.forEach(callback);
    };

    return GamePadHandler;

})(GamePad, navigator.webkitGetGamepads.bind(navigator));