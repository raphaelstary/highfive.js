var FireGame = (function (calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, FireFighterView, Level, PeopleView, TimeView, PropertyManagement) {
    "use strict";

    function FireGame(stage, sceneStorage, gameLoop, tapController, messages, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.tapController = tapController;
        this.messages = messages;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    FireGame.prototype.__init = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        this.resizeBus.add('fire_game', this.resize.bind(this));
    };

    FireGame.prototype.__unload = function () {
        delete this.screenWidth;
        delete this.screenHeight;
        delete this.backGroundDrawable;

        this.resizeBus.remove('fire_game');
    };

    var FONT_FACE = 'Arial';
    var FONT_COLOR = '#c4c4c4';

    FireGame.prototype.__setupDrawables = function () {
        var self = this;

        var backGroundDrawable = this.backGroundDrawable = this.stage.drawFresh(function () {return widthHalf(self.screenWidth);},
            function () {return heightHalf(self.screenHeight);}, 'scene', 0);

        function getTimeX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3);
        }
        var timeLeftDrawable = this.stage.drawText(getTimeX, function () {return getTopRaster(self.screenHeight);},
            "2:00:00", 45, FONT_FACE, FONT_COLOR);


        function getPeopleLeftX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3, 2);
        }
        var peopleLeftDrawable = this.stage.drawText(getPeopleLeftX, function () {return getTopRaster(self.screenHeight);},
            "10 left", 45, FONT_FACE, FONT_COLOR);


        var fireFighterDrawable = this.stage.drawFresh(function () {return widthHalf(self.screenWidth);},
            function () {return calcScreenConst(self.screenHeight, 20, 19)}, 'firefighter', 3);


        return {
            backGround: backGroundDrawable,
            timeLeft: timeLeftDrawable,
            peopleLeft: peopleLeftDrawable,
            fireFighter: fireFighterDrawable
        }
    };

    FireGame.prototype.show = function (nextScene, width, height) {
        this.__init(width, height);

        var drawables = this.__setupDrawables();

        var firstLevelData = {
            time: 60*3,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat']
        };


        var firstLevel = new Level(firstLevelData, new TimeView(drawables.timeLeft), new PeopleView(drawables.peopleLeft),
            new FireFighterView(drawables.fireFighter, drawables.backGround, this.screenWidth),
            new PropertyManagement(new WindowView(this.stage, drawables.backGround)));

        this.resizeBus.add('level', firstLevel.resize.bind(firstLevel));
        this.gameLoop.add('level', firstLevel.tick.bind(firstLevel));

        firstLevel.start();

//        wView.createDrawableAtSpot1('baby_inside');
//        wView.createDrawableAtSpot2('cat_inside');
//        wView.createDrawableAtSpot3('cat_inside');
//        wView.createDrawableAtSpot4('cat_inside');
//        wView.createDrawableAtSpot5('cat_inside');
//        wView.createDrawableAtSpot6('cat_inside');
//        wView.createDrawableAtSpot7('cat_inside');
//        wView.createDrawableAtSpot8('cat_inside');
//        wView.createDrawableAtSpot9('cat_inside');
    };

    FireGame.prototype.next = function (nextScene) {
        this.__unload();

        nextScene();
    };

    FireGame.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        changeCoords(this.backGroundDrawable, widthHalf(this.screenWidth), heightHalf(this.screenHeight));

        this.stage.resize(width, height);
    };

    return FireGame;
})(calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, FireFighterView, Level, PeopleView, TimeView, PropertyManagement);