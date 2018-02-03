H5.installWebAudioSprite = (function (Event) {
    'use strict';

    function installHtmlAudioSprite(events, audioSprite) {
        events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden) {
                audioSprite.pauseAll();
            } else {
                audioSprite.resumeAll();
            }
        });
    }

    return installHtmlAudioSprite;
})(H5.Event);
