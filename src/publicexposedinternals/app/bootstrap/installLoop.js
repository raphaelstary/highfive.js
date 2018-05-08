H5.installLoop = (function (GameLoop, Event) {
    'use strict';

    function installLoop(visuals, events) {

        var gameLoop = new GameLoop(events);

        events.subscribe(Event.TICK_MOVE, visuals.updateMove.bind(visuals));
        events.subscribe(Event.TICK_CAMERA, visuals.clear.bind(visuals));
        events.subscribe(Event.TICK_DRAW, visuals.updateDraw.bind(visuals));
        events.subscribe(Event.TICK_START, events.updateDeletes.bind(events));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(H5.GameLoop, H5.Event);
