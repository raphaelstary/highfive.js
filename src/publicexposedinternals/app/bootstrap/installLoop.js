H5.installLoop = (function (GameLoop, Event) {
    'use strict';

    function installLoop(stage, events) {

        var gameLoop = new GameLoop(events);

        events.subscribe(Event.TICK_MOVE, stage.updateMove.bind(stage));
        events.subscribe(Event.TICK_CAMERA, stage.clear.bind(stage));
        events.subscribe(Event.TICK_DRAW, stage.updateDraw.bind(stage));
        events.subscribe(Event.TICK_START, events.updateDeletes.bind(events));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(H5.GameLoop, H5.Event);