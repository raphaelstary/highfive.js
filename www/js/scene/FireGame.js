var FireGame = (function (bootStrapDrawables, WindowPusher, WindowView, Level, PeopleView, TimeView, PropertyManagement) {
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
        var drawables = bootStrapDrawables(this.stage);

        var firstLevelData = {
            time: 30,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat', 'baby'],
            bulkyWaste: ['lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan'],
            fireFighters: [{speed: 3}],
            percentageForPeople: 50
        };

        var peopleView = new PeopleView(drawables.peopleLeft);
        var objectsToCatch = {};
        var objectsToAvoid = {};
        var windowPusher = new WindowPusher(this.stage, objectsToCatch, objectsToAvoid);
        var windowView = new WindowView(this.stage, drawables.backGround);
        var propertyManagement = new LevelGenerator(windowView, this.tapController,
            windowPusher);

        var firstLevel = new Level(firstLevelData, new TimeView(drawables.timeLeft), peopleView, propertyManagement,
            windowPusher, objectsToCatch, objectsToAvoid, this.stage, drawables);

        this.gameLoop.add('level', firstLevel.tick.bind(firstLevel));

        var self = this;
        firstLevel.success = function () {
            firstLevel.success = undefined;
            firstLevel.failure = undefined;
        };

        firstLevel.failure = function () {
            firstLevel.success = undefined;
            firstLevel.failure = undefined;

            for (var key in drawables) {
                var drawable = drawables[key];
                self.stage.remove(drawable);
            }
            nextScene();
        };

        firstLevel.start();
    };

    return FireGame;
})(bootStrapDrawables, WindowPusher, WindowView, Level, PeopleView, TimeView, LevelGenerator);