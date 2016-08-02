H5.installLoop = (function (GameLoop, Event) {
    "use strict";

    function installLoop(stages, events) {

        var gameLoop = new GameLoop(events);
        var installOnlyOnce = true;
        stages.forEach(function (stage) {
            if (installOnlyOnce) {
                installOnlyOnce = false;
                events.subscribe(Event.TICK_CAMERA, stage.clear.bind(stage));
            }
            events.subscribe(Event.TICK_DRAW, stage.update.bind(stage));
        });
        events.subscribe(Event.TICK_START, events.updateDeletes.bind(events));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(H5.GameLoop, H5.Event);