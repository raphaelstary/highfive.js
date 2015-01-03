var installLoop = (function (GameLoop, Event, stats) {
    "use strict";

    function installLoop(stage, events) {

        var gameLoop = new GameLoop(events);

        events.subscribe(Event.TICK_DRAW, stage.update.bind(stage));
        events.subscribe(Event.TICK_INPUT, events.updateDeletes.bind(events));

        events.subscribe(Event.TICK_START, stats.begin.bind(stats));
        events.subscribe(Event.TICK_END, stats.end.bind(stats));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(GameLoop, Event, stats);