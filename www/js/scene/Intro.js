var Intro = (function (Transition, calcScreenConst, changeCoords, changePath, SpeedStripesHelper) {
    "use strict";

    function Intro(stage, sceneStorage, gameLoop, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.resizeBus = resizeBus;
    }

    var SPEED = 'speed';
    var BACKGROUND = 'background';
    var LOGO = 'letsplayIO_logo';
    var PRESENTS = 'presents';
    var GAME_LOGO = 'shields_up_logo/shields_up_logo';

    Intro.prototype._createDrawables = function (screenWidth, screenHeight) {
        var drawableStorage = {};

        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);

        drawableStorage.firstBg = this.stage.drawFresh(screenWidthHalf, screenHeightHalf,
            BACKGROUND, 0);

        drawableStorage.scrollingBackGround = this.stage.getDrawable(screenWidthHalf,
                screenHeightHalf + screenHeight, BACKGROUND, 0);

        var speedY = 0; // 600

        drawableStorage.speedDrawableOne = this.stage.getDrawable(calcScreenConst(screenWidth, 4), speedY, SPEED, 1);
        drawableStorage.speedDrawableTwo = this.stage.getDrawable(calcScreenConst(screenWidth, 8, 7),
                speedY - calcScreenConst(screenHeight, 5), SPEED, 1);
        drawableStorage.speedDrawableThree = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 2), SPEED, 1);
        drawableStorage.speedDrawableFour = this.stage.getDrawable(calcScreenConst(screenWidth, 16, 7),
                speedY - calcScreenConst(screenHeight, 5, 3), SPEED, 1);
        drawableStorage.speedDrawableFive = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 4), SPEED, 1);
        drawableStorage.speedDrawableSix = this.stage.getDrawable(calcScreenConst(screenWidth, 3, 2),
                speedY - calcScreenConst(screenHeight, 16, 5), SPEED, 1);

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);


        drawableStorage.letsplayIO = this.stage.getDrawable(x, y + irgendwasLogo, LOGO, 2);

        drawableStorage.presentsDrawable = this.stage.getDrawable(x, y, PRESENTS, 2);

        drawableStorage.logoDrawable = this.stage.animateFresh(x, y, GAME_LOGO, 60);

        return drawableStorage;
    };

    Intro.prototype._resizeDrawables = function (screenWidth, screenHeight, drawableStorage) {
        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);

        changeCoords(drawableStorage.firstBg, screenWidthHalf, screenHeightHalf);

        if (this.backGroundHasNewPosition)
            changeCoords(drawableStorage.scrollingBackGround, screenWidthHalf, screenHeightHalf);
        else
            changeCoords(drawableStorage.scrollingBackGround, screenWidthHalf, screenHeightHalf + screenHeight);

        var speedY = 0; // 600
        changeCoords(drawableStorage.speedDrawableOne, calcScreenConst(screenWidth, 4), speedY);
        changeCoords(drawableStorage.speedDrawableTwo, calcScreenConst(screenWidth, 8, 7),
                speedY - calcScreenConst(screenHeight, 5));
        changeCoords(drawableStorage.speedDrawableThree, calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 2));
        changeCoords(drawableStorage.speedDrawableFour, calcScreenConst(screenWidth, 16, 7),
                speedY - calcScreenConst(screenHeight, 5, 3));
        changeCoords(drawableStorage.speedDrawableFive, calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 4));
        changeCoords(drawableStorage.speedDrawableSix, calcScreenConst(screenWidth, 3, 2),
                speedY - calcScreenConst(screenHeight, 16, 5));

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);

        changeCoords(drawableStorage.letsplayIO, x, y + irgendwasLogo);

        changeCoords(drawableStorage.presentsDrawable, x, y);
        changeCoords(drawableStorage.logoDrawable, x, y);
    };

    Intro.prototype._createMotion = function (screenWidth, screenHeight) {
        var motionStorage = {};

        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);

        motionStorage.firstBgPath = this.stage.getPath(screenWidthHalf, screenHeightHalf,
            screenWidthHalf, screenHeightHalf - screenHeight, 120, Transition.LINEAR);

        motionStorage.scrollingBgPath = this.stage.getPath(screenWidthHalf,
                screenHeightHalf + screenHeight, screenWidthHalf,
            screenHeightHalf, 120, Transition.LINEAR);

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas,
            yEnd = - irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);
        var irgendwasPresents = irgendwasLogo * 2;

        var logoYEnd = calcScreenConst(screenHeight, 32, 7);

        motionStorage.letsplayIOPath = this.stage.getPath(x, y + irgendwasLogo, x, yEnd - irgendwasLogo, 120,
            Transition.EASE_OUT_IN_SIN);

        motionStorage.presentsPath = this.stage.getPath(x, y + irgendwasPresents, x, yEnd + irgendwasLogo, 120,
            Transition.EASE_OUT_IN_SIN);

        motionStorage.logoInPath = this.stage.getPath(x, y, x, logoYEnd, 120, Transition.EASE_OUT_QUAD);

        return motionStorage;
    };

    Intro.prototype._resizeMotion = function (screenWidth, screenHeight, motionStorage) {
        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);

        changePath(motionStorage.firstBgPath ,screenWidthHalf, screenHeightHalf,
            screenWidthHalf, screenHeightHalf - screenHeight);

        changePath(motionStorage.scrollingBgPath ,screenWidthHalf,
                screenHeightHalf + screenHeight, screenWidthHalf,
            screenHeightHalf);

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas,
            yEnd = - irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);
        var irgendwasPresents = irgendwasLogo * 2;

        var logoYEnd = calcScreenConst(screenHeight, 32, 7);

        changePath(motionStorage.letsplayIOPath ,x, y + irgendwasLogo, x, yEnd - irgendwasLogo);

        changePath(motionStorage.presentsPath ,x, y + irgendwasPresents, x, yEnd + irgendwasLogo);

        changePath(motionStorage.logoInPath ,x, y, x, logoYEnd);
    };

    Intro.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add('intro_scene', this.resize.bind(this));

        this.drawableStorage = this._createDrawables(screenWidth, screenHeight);
        this.motionStorage = this._createMotion(screenWidth, screenHeight);

        var self = this;
        var speedos = [this.drawableStorage.speedDrawableOne, this.drawableStorage.speedDrawableTwo,
            this.drawableStorage.speedDrawableThree, this.drawableStorage.speedDrawableFour,
            this.drawableStorage.speedDrawableFive, this.drawableStorage.speedDrawableSix];

        speedos.forEach(function (speeeed) {
            self.stage.draw(speeeed);
        });

        this.speedos = speedos;
        this.lastY = this.drawableStorage.letsplayIO.y;
        this.hasNotStarted = true;
        this.yVelocity = calcScreenConst(screenHeight, 48);
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.nextScene = nextScene;

        this.gameLoop.add('z_parallax', this._parallaxUpdate.bind(this));


    };

    Intro.prototype._parallaxUpdate = function () {
        var delta = this.lastY - this.drawableStorage.letsplayIO.y;
        this.lastY = this.drawableStorage.letsplayIO.y;
        var self = this;
        this.speedos.forEach(function (speeeeeeed) {
            speeeeeeed.y += self.yVelocity;

            speeeeeeed.y -= delta * 2;

            if (speeeeeeed.y > 600) {
                self.stage.remove(speeeeeeed);
            }
        });

        if (this.drawableStorage.speedDrawableOne.y >= this.screenHeight && this.hasNotStarted) {
            this.hasNotStarted = false;

            self.stage.move(this.drawableStorage.firstBg, this.motionStorage.firstBgPath, function () {
                self.stage.remove(self.drawableStorage.firstBg);
            });
            self.stage.move(this.drawableStorage.scrollingBackGround, this.motionStorage.scrollingBgPath, function () {
                self.drawableStorage.scrollingBackGround.y = calcScreenConst(self.screenHeight, 2);
                self.backGroundHasNewPosition = true;
            });

            self.stage.move(this.drawableStorage.letsplayIO, this.motionStorage.letsplayIOPath, function () {
                self.stage.remove(self.drawableStorage.letsplayIO);
            });

            self.stage.move(this.drawableStorage.presentsDrawable, this.motionStorage.presentsPath, function () {
                self.stage.remove(self.drawableStorage.presentsDrawable);
            });

            var speedStripes;
            self.stage.moveLater({item: this.drawableStorage.logoDrawable, path: this.motionStorage.logoInPath,
                ready: function () {

                    self.next(self.nextScene, self.drawableStorage.logoDrawable, speedStripes,
                        self.drawableStorage.scrollingBackGround);

                }}, 90, function () {
                var delay = 30;
                speedStripes = SpeedStripesHelper.draw(self.stage, delay, self.screenWidth, self.screenHeight);
            });
        }
    };

    Intro.prototype.resize = function (width, height) {
        this.yVelocity = calcScreenConst(height, 48);
        this.screenWidth = width;
        this.screenHeight = height;

        this._resizeDrawables(width, height, this.drawableStorage);
        this._resizeMotion(width, height, this.motionStorage);
    };

    Intro.prototype.next = function (nextScene, logoDrawable, speedStripes, backGround) {
        delete this.speedos;
        delete this.lastY;
        delete this.hasNotStarted;
        delete this.yVelocity;
        delete this.screenWidth;
        delete this.screenHeight;
        delete this.nextScene;
        delete this.backGroundHasNewPosition;

        delete this.drawableStorage;
        delete this.motionStorage;

        this.resizeBus.remove('intro_scene');
        this.gameLoop.remove('z_parallax');

        this.sceneStorage.logo = logoDrawable;
        this.sceneStorage.speedStripes = speedStripes;
        this.sceneStorage.backGround = backGround;

        nextScene();
    };

    return Intro;
})(Transition, calcScreenConst, changeCoords, changePath, SpeedStripesHelper);