var StartingPosition = (function (Transition, calcScreenConst, CountHelper, getTopRaster, Repository, changeCoords, changePath, GameStuffHelper) {
    "use strict";

    function StartingPosition(stage, sceneStorage, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.resizeBus = resizeBus;
    }

    StartingPosition.prototype.checkPreConditions = function (screenWidth, screenHeight) {
        GameStuffHelper.draw(this.stage, this.sceneStorage, screenWidth, screenHeight);
    };

    StartingPosition.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add('starting_position_scene', this.resize.bind(this));

        this.checkPreConditions(screenWidth, screenHeight);

        var self = this;
        self.resizeRepo = new Repository();
        var zero = 'num/numeral0';
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        function yTop() {
            return getTopRaster(self.screenHeight);
        }
        function lifeX() {
            return calcScreenConst(self.screenWidth, 10);
        }

        function lifeStartX() {
            var x = lifeX();
            return x - x * 2;
        }

        function yBottom() {
            return yTop() * 19;
        }

        var lifeOneWrapper = self.stage.moveFreshLater(lifeStartX(), yTop(), 'playerlife', lifeX(), yTop(), speed,
            spacing, 20, false, function () {
                self.resizeRepo.add(lifeOneWrapper.drawable, function () {
                    changeCoords(lifeOneWrapper.drawable, lifeX(), yTop());
                });
                goodToGo();
            });
        self.resizeRepo.add(lifeOneWrapper.drawable, function () {
            changeCoords(lifeOneWrapper.drawable, lifeStartX(), yTop());
            changePath(lifeOneWrapper.path, lifeStartX(), yTop(), lifeX(), yTop());
        });

        var lifeOffSet = self.stage.getSubImage('playerlife').width;

        function lifeTwoEndX() {
            return lifeX() + lifeOffSet;
        }

        var lifeTwoWrapper = self.stage.moveFreshLater(lifeStartX(), yTop(), 'playerlife', lifeTwoEndX(), yTop(),
            speed, spacing, 15, false, function () {
                self.resizeRepo.add(lifeTwoWrapper.drawable, function () {
                    changeCoords(lifeTwoWrapper.drawable, lifeTwoEndX(), yTop());
                });
                goodToGo();
            });
        self.resizeRepo.add(lifeTwoWrapper.drawable, function () {
            changeCoords(lifeTwoWrapper.drawable, lifeStartX(), yTop());
            changePath(lifeTwoWrapper.path, lifeStartX(), yTop(), lifeTwoEndX(), yTop());
        });

        function lifeThreeEndX() {
            return lifeX() + lifeOffSet * 2;
        }

        var lifeThreeWrapper = self.stage.moveFreshLater(lifeStartX(), yTop(), 'playerlife', lifeThreeEndX(), yTop(),
            speed, spacing, 10, false, function () {
                self.resizeRepo.add(lifeThreeWrapper.drawable, function () {
                    changeCoords(lifeThreeWrapper.drawable, lifeThreeEndX(), yTop());
                });
                goodToGo();
            });
        self.resizeRepo.add(lifeThreeWrapper.drawable, function () {
            changeCoords(lifeThreeWrapper.drawable, lifeStartX(), yTop());
            changePath(lifeThreeWrapper.path, lifeStartX(), yTop(), lifeThreeEndX(), yTop());
        });

        function energyX() {
            calcScreenConst(self.screenWidth, 32, 7);
        }

        function energyStartX() {
            var x = energyX();
            return x - x * 2;
        }

        var energyBarWrapper = self.stage.moveFresh(energyStartX(), yBottom(), 'energy_bar_full', energyX(), yBottom(),
            speed, spacing, false, function () {
                self.resizeRepo.add(energyBarWrapper.drawable, function() {
                    changeCoords(energyBarWrapper.drawable, energyX(), yBottom());
                });
                goodToGo();
            });
        self.resizeRepo.add(energyBarWrapper.drawable, function() {
            changeCoords(energyBarWrapper.drawable, energyStartX(), yBottom());
            changePath(energyBarWrapper.path, energyStartX(), yBottom(), energyX(), yBottom());
        });

        var screenOffSet = calcScreenConst(screenWidth, 5);
        var firstX = CountHelper.get1stX(self.stage, screenWidth);
        var firstDigitWrapper = self.stage.moveFreshLater(firstX + screenOffSet, yTop(), zero, firstX, yTop(), speed,
            spacing, 10, false, function () {
                self.resizeRepo.add(firstDigitWrapper.drawable, function () {
                    CountHelper.resize1st(firstDigitWrapper.drawable)
                });
                goodToGo();
            });
        self.resizeRepo.add(firstDigitWrapper.drawable, function () {
            CountHelper.resize1stWrapper(firstDigitWrapper, self.stage, self.screenWidth, self.screenHeight);
        });

        var secondX = CountHelper.get2ndX(self.stage, screenWidth);
        var secondDigitWrapper = self.stage.moveFreshLater(secondX + screenOffSet, yTop(), zero, secondX, yTop(), speed,
            spacing, 13, false, function () {
                self.resizeRepo.add(secondDigitWrapper.drawable, function () {
                    CountHelper.resize2nd(secondDigitWrapper.drawable, self.stage, self.screenWidth, self.screenHeight);
                });
                goodToGo();
            });
        self.resizeRepo.add(secondDigitWrapper.drawable, function () {
            CountHelper.resize2ndWrapper(secondDigitWrapper, self.stage, self.screenWidth, self.screenHeight);
        });

        var thirdX = CountHelper.get3rdX(self.stage, screenWidth);
        var thirdDigitWrapper = self.stage.moveFreshLater(thirdX + screenOffSet, yTop(), zero, thirdX, yTop(), speed,
            spacing, 17, false, function () {
                self.resizeRepo.add(thirdDigitWrapper.drawable, function () {
                    CountHelper.resize3rd(thirdDigitWrapper.drawable, self.stage, self.screenWidth, self.screenHeight);
                });
                goodToGo();
            });
        self.resizeRepo.add(thirdDigitWrapper.drawable, function () {
            CountHelper.resize3rdWrapper(thirdDigitWrapper, self.stage, self.screenWidth, self.screenHeight);
        });

        var fourthX = CountHelper.get4thX(self.stage, screenWidth);
        var fourthDigitWrapper = self.stage.moveFreshLater(fourthX + screenOffSet, yTop(), zero, fourthX, yTop(), speed,
            spacing, 12, false, function () {
                self.resizeRepo.add(fourthDigitWrapper.drawable, function () {
                    CountHelper.resize4th(fourthDigitWrapper.drawable, self.stage, self.screenWidth, self.screenHeight);
                });
                goodToGo();
        });
        self.resizeRepo.add(fourthDigitWrapper.drawable, function () {
            CountHelper.resize4thWrapper(fourthDigitWrapper, self.stage, self.screenWidth, self.screenHeight);
        });

        var numberOfCallbacks = 8;
        function goodToGo() {
            if (--numberOfCallbacks > 0)
                return;

            var lifeDrawablesDict = {1: lifeOneWrapper.drawable, 2: lifeTwoWrapper.drawable,
                3: lifeThreeWrapper.drawable};
            var countDrawables = [firstDigitWrapper.drawable, secondDigitWrapper.drawable, thirdDigitWrapper.drawable,
                fourthDigitWrapper.drawable];

            self.next(nextScene, energyBarWrapper.drawable, lifeDrawablesDict, countDrawables);
        }
    };

    StartingPosition.prototype.next = function (nextScene, energyBarDrawable, lifeDrawablesDict, countDrawables) {
        this.sceneStorage.energyBar = energyBarDrawable;
        this.sceneStorage.lives = lifeDrawablesDict;
        this.sceneStorage.counts = countDrawables;

        this.resizeBus.remove('starting_position_scene');
        delete this.resizeRepo;

        nextScene();
    };

    StartingPosition.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);
        this.resizeRepo.call();
    };

    return StartingPosition;
})(Transition, calcScreenConst, CountHelper, getTopRaster, Repository, changeCoords, changePath, GameStuffHelper);