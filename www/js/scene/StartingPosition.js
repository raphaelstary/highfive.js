var StartingPosition = (function (Transition, calcScreenConst) {
    "use strict";

    function StartingPosition(stage, sceneStorage) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
    }

    StartingPosition.prototype.checkPreConditions = function (screenWidth, screenHeight) {
        var __400 = calcScreenConst(screenHeight, 6, 5);
        var widthHalf = calcScreenConst(screenWidth, 2);

        if (this.sceneStorage.speedStripes === undefined) {
            this.sceneStorage.speedStripes = showSpeedStripes(this.stage, 0, screenWidth, screenHeight);
        }
        if (!this.sceneStorage.ship) {
            this.sceneStorage.ship = this.stage.drawFresh(widthHalf, __400, 'ship');
        }
        if (!this.sceneStorage.fire) {
            this.sceneStorage.fire = this.stage.animateFresh(widthHalf, __400, 'fire-anim/fire', 8);
        }
        if (!this.sceneStorage.backGround) {
            this.sceneStorage.backGround = this.stage.drawFresh(widthHalf, calcScreenConst(screenHeight, 2),
                'background', 0);
        }
    };

    StartingPosition.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.checkPreConditions(screenWidth, screenHeight);

        var self = this;
        var zero = 'num/numeral0';
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;
        var yTop = calcScreenConst(screenHeight, 20);
        var yBottom = yTop * 19;
        var lifeX = calcScreenConst(screenWidth, 10);
        var lifeOneDrawable = self.stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX, yTop, speed,
            spacing, 20);
        var lifeOffSet = self.stage.getSubImage('playerlife').width;
        var lifeTwoDrawable = self.stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX + lifeOffSet, yTop,
            speed, spacing, 15);
        var lifeThreeDrawable = self.stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX + lifeOffSet * 2,
            yTop, speed, spacing, 10);
        var energyX = calcScreenConst(screenWidth, 32, 7);
        var energyBarDrawable = self.stage.moveFresh(energyX - energyX * 2, yBottom, 'energy_bar_full', energyX,
            yBottom, speed, spacing);
        var digitWidthHalf = calcScreenConst(self.stage.getSubImage('num/numeral0').width, 2);
        var digitX = calcScreenConst(screenWidth, 3, 2) + digitWidthHalf;
        var digitOffSet = calcScreenConst(self.stage.getSubImage('num/numeral0').width, 3, 4);
        var firstDigit = digitX + digitOffSet * 3;
        var screenOffSet = calcScreenConst(screenWidth, 5);
        var firstDigitDrawable = self.stage.moveFreshLater(firstDigit + screenOffSet, yTop, zero, firstDigit, yTop,
            speed, spacing, 10);
        var secondDigit = digitX + digitOffSet * 2;
        var secondDigitDrawable = self.stage.moveFreshLater(secondDigit + screenOffSet, yTop, zero, secondDigit, yTop,
            speed, spacing, 13);
        var thirdDigit = digitX + digitOffSet;
        var thirdDigitDrawable = self.stage.moveFreshLater(thirdDigit + screenOffSet, yTop, zero, thirdDigit, yTop,
            speed, spacing, 17);
        var fourthDigitDrawable = self.stage.moveFreshLater(digitX + screenOffSet, yTop, zero, digitX, yTop, speed,
            spacing, 12, false, function () {

            var lifeDrawablesDict = {1: lifeOneDrawable, 2: lifeTwoDrawable, 3: lifeThreeDrawable};
            var countDrawables = [firstDigitDrawable, secondDigitDrawable, thirdDigitDrawable, fourthDigitDrawable];

            self.next(nextScene, energyBarDrawable, lifeDrawablesDict, countDrawables)
        });
    };

    StartingPosition.prototype.next = function (nextScene, energyBarDrawable, lifeDrawablesDict, countDrawables) {
        this.sceneStorage.energyBar = energyBarDrawable;
        this.sceneStorage.lives = lifeDrawablesDict;
        this.sceneStorage.counts = countDrawables;

        nextScene();
    };

    function showSpeedStripes(stage, delay, screenWidth, screenHeight) {
        var speedStripes = [];
        var yOffSet = calcScreenConst(stage.getSubImage('speed').width, 2);
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 4), yOffSet, 0 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 3, 2), yOffSet, 34 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 8, 7), yOffSet, 8 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16, 7), yOffSet, 24 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16), yOffSet, 16 + delay, screenHeight));

        return speedStripes;
    }

    function drawSpeed(stage, x, yOffSet, delay, screenHeight) {
        return stage.moveFreshLater(x, - yOffSet, 'speed', x, screenHeight + yOffSet, 30, Transition.LINEAR, delay,
            true);
    }

    return StartingPosition;
})(Transition, calcScreenConst);