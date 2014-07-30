var StartingPosition = (function (Transition, calcScreenConst, showSpeedStripes, ShipHelper, FireHelper, BackGroundHelper, CountHelper, getTopRaster) {
    "use strict";

    function StartingPosition(stage, sceneStorage) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
    }

    StartingPosition.prototype.checkPreConditions = function (screenWidth, screenHeight) {
        if (this.sceneStorage.speedStripes === undefined) {
            this.sceneStorage.speedStripes = showSpeedStripes(this.stage, 0, screenWidth, screenHeight);
        }
        if (!this.sceneStorage.ship) {
            this.sceneStorage.ship = ShipHelper.draw(this.stage, screenWidth, screenHeight);
        }
        if (!this.sceneStorage.fire) {
            this.sceneStorage.fire = FireHelper.draw(this.stage, screenWidth, screenHeight);
        }
        if (!this.sceneStorage.backGround) {
            this.sceneStorage.backGround = BackGroundHelper.draw(this.stage, screenWidth, screenHeight);
        }
    };

    StartingPosition.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.checkPreConditions(screenWidth, screenHeight);

        var self = this;
        var zero = 'num/numeral0';
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;

        var yTop = getTopRaster(screenHeight);

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

        var screenOffSet = calcScreenConst(screenWidth, 5);

        var firstX = CountHelper.get1stX(self.stage, screenWidth);
        var firstDigitDrawable = self.stage.moveFreshLater(firstX + screenOffSet, yTop, zero, firstX, yTop, speed,
            spacing, 10);
        var secondX = CountHelper.get2ndX(self.stage, screenWidth);
        var secondDigitDrawable = self.stage.moveFreshLater(secondX + screenOffSet, yTop, zero, secondX, yTop, speed,
            spacing, 13);
        var thirdX = CountHelper.get3rdX(self.stage, screenWidth);
        var thirdDigitDrawable = self.stage.moveFreshLater(thirdX + screenOffSet, yTop, zero, thirdX, yTop, speed,
            spacing, 17);
        var fourthX = CountHelper.get4thX(self.stage, screenWidth);
        var fourthDigitDrawable = self.stage.moveFreshLater(fourthX + screenOffSet, yTop, zero, fourthX, yTop, speed,
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

    return StartingPosition;
})(Transition, calcScreenConst, showSpeedStripes, ShipHelper, FireHelper, BackGroundHelper, CountHelper, getTopRaster);