var installLoop = (function (GameLoop) {
    "use strict";

    function installLoop(stage) {

        var gameLoop = new GameLoop();
        gameLoop.add('stage', stage.tick.bind(stage));
        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(GameLoop);