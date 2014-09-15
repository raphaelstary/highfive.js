var FireGame = (function (bootStrapDrawables, WindowPusher, WindowView, Level, PeopleView, TimeView, LevelModel, LevelGenerator, NextFire, YouWon) {
    "use strict";

    function FireGame(stage, gameLoop, tapController, messages, sounds, resizeBus) {
        this.stage = stage;
        this.gameLoop = gameLoop;
        this.tapController = tapController;
        this.messages = messages;
        this.sounds = sounds;
        this.resizeBus = resizeBus;
    }

    FireGame.prototype.show = function (nextScene) {
        var levelGenerator = new LevelGenerator();

        this.__nextLevel(levelGenerator.next(), bootStrapDrawables(this.stage), nextScene,
            levelGenerator.next.bind(levelGenerator))
    };

    FireGame.prototype.__nextLevel = function (levelData, baseDrawables, nextScene, nextLevel) {
        var peopleView = new PeopleView(baseDrawables.peopleLeft);
        var objectsToCatch = {};
        var objectsToAvoid = {};
        var windowPusher = new WindowPusher(this.stage, objectsToCatch, objectsToAvoid);
        var windowView = new WindowView(this.stage, baseDrawables.backGround);
        var propertyManagement = new LevelModel(windowView, this.tapController,
            windowPusher);

        var level = new Level(levelData, new TimeView(baseDrawables.timeLeft), peopleView, propertyManagement,
            windowPusher, objectsToCatch, objectsToAvoid, this.stage, baseDrawables);

        this.gameLoop.add('level', level.tick.bind(level));

        var self = this;
        level.success = function () {
            level.success = undefined;
            level.failure = undefined;
            self.gameLoop.remove('level');

            var nxtLvl = nextLevel();
            if (nxtLvl === false) {
                new YouWon(self.stage).show();
            } else {
                new NextFire(self.stage).show(self.__nextLevel.bind(self, nxtLvl, baseDrawables, nextScene, nextLevel));
            }
        };

        level.failure = function () {
            level.success = undefined;
            level.failure = undefined;
            self.gameLoop.remove('level');

            for (var key in baseDrawables) {
                var drawable = baseDrawables[key];
                self.stage.remove(drawable);
            }
            nextScene();
        };

        level.start();
    };

    return FireGame;
})(bootStrapDrawables, WindowPusher, WindowView, Level, PeopleView, TimeView, LevelModel, LevelGenerator, NextFire, YouWon);