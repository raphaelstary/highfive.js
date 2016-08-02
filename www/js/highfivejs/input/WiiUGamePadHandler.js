H5.WiiUGamePadHandler = (function () {
    "use strict";

    function WiiUGamePadHandler(events, gamePad, remotes) {
        this.events = events;
        this.gamePad = gamePad;
        this.remotes = remotes;
    }

    WiiUGamePadHandler.prototype.update = function () {
        if (this.gamePad.update()) {
            this.events.fireSync(Event.GAME_PAD, this.gamePad);
        }
    };

    return WiiUGamePadHandler;
})();