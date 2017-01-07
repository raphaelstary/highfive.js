H5.installAudioSprite = (function (Event) {
    "use strict";

    function installAudioSprite(events, stage, audioSprite) {
        events.subscribe(Event.TICK_MOVE, audioSprite.update.bind(audioSprite));
        audioSprite.setStage(stage);
    }

    return installAudioSprite;
})(H5.Event);