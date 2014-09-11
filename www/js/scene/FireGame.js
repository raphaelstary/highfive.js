var FireGame = (function (Transition, WindowPusher, calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, Level, PeopleView, TimeView, PropertyManagement) {
    "use strict";

    function FireGame(stage, gameLoop, tapController, messages, sounds, resizeBus) {
        this.stage = stage;
        this.gameLoop = gameLoop;
        this.tapController = tapController;
        this.messages = messages;
        this.sounds = sounds;
        this.resizeBus = resizeBus;
    }

    var FONT_FACE = 'Arial';
    var FONT_COLOR = '#c4c4c4';

    FireGame.prototype.__setupDrawables = function () {
        var self = this;

        var backGroundDrawable = this.stage.drawFresh(widthHalf, heightHalf, 'scene', 0);

        function getTimeX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3);
        }
        function fontSize(width, height) {
            return calcScreenConst(height, 15);
        }
        var timeLeftDrawable = this.stage.drawText(getTimeX, getTopRaster, "2:00:00", fontSize, FONT_FACE, FONT_COLOR, 3,
            [backGroundDrawable]);


        function getPeopleLeftX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3, 2);
        }
        var peopleLeftDrawable = this.stage.drawText(getPeopleLeftX, getTopRaster, "10 left", fontSize, FONT_FACE, FONT_COLOR,
            3, [backGroundDrawable]);

        function fireFighterA_X(width) {
            return backGroundDrawable.getCornerX() < calcScreenConst(width, 20) ?
                calcScreenConst(width, 20) : backGroundDrawable.getCornerX();
        }
        function fireFighter_Y(height) {
            return calcScreenConst(height, 20, 19);
        }
        function fireFighterB_X(width) {
            return backGroundDrawable.getEndX() < calcScreenConst(width, 20, 19) ?
                backGroundDrawable.getEndX() : calcScreenConst(width, 20, 19);
        }
        function fireFighterSpeed(width) {
            var distance = fireFighterB_X(width) - fireFighterA_X(width);
            return calcScreenConst(distance, 3);
        }
        function fromAtoB() {
            self.stage.remove(fireFighterWrapper.drawable);
            initFireFighter();
        }
        function fromBtoA() {
            self.stage.remove(fireFighterWrapper.drawable);
            var newWrapper = self.stage.moveFresh(fireFighterB_X, fireFighter_Y, 'firefighter', fireFighterA_X,
                fireFighter_Y, fireFighterSpeed, Transition.EASE_IN_OUT_SIN, false, fromAtoB, [backGroundDrawable]);

            fireFighterWrapper.drawable = newWrapper.drawable;
            fireFighterWrapper.path = newWrapper.path;
        }
        function initFireFighter() {
            var newWrapper = self.stage.moveFresh(fireFighterA_X, fireFighter_Y, 'firefighter', fireFighterB_X,
                fireFighter_Y, fireFighterSpeed, Transition.EASE_IN_OUT_SIN, false, fromBtoA, [backGroundDrawable]);

            fireFighterWrapper.drawable = newWrapper.drawable;
            fireFighterWrapper.path = newWrapper.path;
        }

        var fireFighterWrapper = {};
        initFireFighter();

        return {
            backGround: backGroundDrawable,
            timeLeft: timeLeftDrawable,
            peopleLeft: peopleLeftDrawable,
            fireFighter: fireFighterWrapper
        };
    };

    FireGame.prototype.show = function (nextScene) {
        var drawables = this.__setupDrawables();

        var firstLevelData = {
            time: 60*3,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat', 'baby']
        };


        var peopleView = new PeopleView(drawables.peopleLeft);
        var windowPusher = new WindowPusher(this.stage, peopleView);
        var windowView = new WindowView(this.stage, drawables.backGround);
        var propertyManagement = new PropertyManagement(windowView, this.tapController,
            windowPusher.pushDown.bind(windowPusher), peopleView.decrease.bind(peopleView));

        var firstLevel = new Level(firstLevelData, new TimeView(drawables.timeLeft),
            peopleView, propertyManagement);

        this.gameLoop.add('level', firstLevel.tick.bind(firstLevel));

        firstLevel.start();
    };

    FireGame.prototype.next = function (nextScene) {

        nextScene();
    };

    return FireGame;
})(Transition, WindowPusher, calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, Level, PeopleView, TimeView, PropertyManagement);