var InGameTutorial = (function (require) {
    "use strict";

    function InGameTutorial(stage, sceneStorage, gameLoop, gameController, messages, tapController, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
        this.messages = messages;
        this.tapController = tapController;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    var SHIELDS_UP = 'shields_up/shields_up';
    var SHIELDS_DOWN = 'shields_down/shields_down';
    var SHIELDS = 'shields';
    var SHIP = 'ship';
    var ASTEROID = 'asteroid_1';

    var FONT = 'KenPixel';
    var WHITE = '#fff';
    var BLACK = '#000';

    var IN_GAME_TUTORIAL_SCENE = 'in_game_tutorial';
    var SHAKE_TUTORIAL = 'shake_tutorial';
    var COLLISION_TUTORIAL = 'collisions_tutorial';

    var TUTORIAL_MSG_KEY = 'tutorial';
    var SKIP_MSG = 'skip';
    var COLLECT_STUFF_MSG = 'collect_stuff';
    var TO_RAISE_SHIELDS_MSG = 'to_raise_shields';
    var TOUCH_AND_HOLD_MSG = 'touch_and_hold';

    var CLICK = 'click';

    var STAR_MOVEMENT = 'star_movement';
    var ASTEROID_MOVEMENT = 'asteroid_movement';
    var BACKGROUND = 'background';
    var DRAIN_ENERGY_MSG = 'drain_energy';
    var STAR_1 = 'star_1/star_1_0000';
    var STAR = 'star_';
    var SHIELDS_UP_TUTORIAL = 'shields_up_tutorial/shields_up_tutorial';
    var BUTTON_PRIM_ACTIVE = 'button_primary_active';
    var OK_MSG = 'ok';
    var BUTTON_PRIM = 'button_primary';
    var NO_ENERGY_MSG = 'no_energy';

    InGameTutorial.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add(IN_GAME_TUTORIAL_SCENE, this.resize.bind(this));
        this.resizeRepo = new require.Repository();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        var self = this;

        function getWidthHalf() {
            return require.calcScreenConst(self.screenWidth, 2);
        }

        function getWidthThird() {
            return require.calcScreenConst(self.screenWidth, 3);
        }

        function getWidthThreeQuarter() {
            return require.calcScreenConst(self.screenWidth, 4, 3);
        }

        function get__400() {
            return require.calcScreenConst(self.screenHeight, 6, 5);
        }

        function getHeightHalf() {
            return require.calcScreenConst(self.screenHeight, 2);
        }

        function getHeightThird() {
            return require.calcScreenConst(self.screenHeight, 3);
        }

        function getHeightQuarter() {
            return require.calcScreenConst(self.screenHeight, 4);
        }

        function getHeightSixteenth() {
            return require.calcScreenConst(self.screenHeight, 16);
        }

        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields ||
                (this.sceneStorage.shields = this.stage.getDrawable(getWidthHalf(), get__400(), SHIELDS)),
            energyBarDrawable = this.sceneStorage.energyBar,
            lifeDrawablesDict = this.sceneStorage.lives,
            countDrawables = this.sceneStorage.counts,
            fireDrawable = this.sceneStorage.fire,
            speedStripes = this.sceneStorage.speedStripes,
            shieldsUpSprite =
                this.sceneStorage.shieldsUp || this.stage.getSprite(SHIELDS_UP, 6, false),
            shieldsDownSprite =
                this.sceneStorage.shieldsDown || this.stage.getSprite(SHIELDS_DOWN, 6, false);

        var shaker = new require.ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1],
            lifeDrawablesDict[2], lifeDrawablesDict[3], fireDrawable]);
        this.resizeShaker = shaker.resize.bind(shaker);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(function (wrapper) {
            shaker.add(wrapper.drawable);
        });

        var trackedAsteroids = {};
        var trackedStars = {};

        var scoreDisplay = new require.Odometer(new require.OdometerView(this.stage, countDrawables));
        var collectAnimator = new require.CollectView(this.stage, shipDrawable, 3);

        var scoreAnimator = new require.ScoreView(this.stage, self.screenWidth, self.screenHeight);
        self.resizeRepo.add({id: 'score_view_tutorial'}, function () {
            scoreAnimator.resize(self.screenWidth, self.screenHeight);
        });

        var shipCollision = new require.CanvasCollisionDetector(this.stage.getSubImage(SHIP), shipDrawable);
        var shieldsCollision = new require.CanvasCollisionDetector(this.stage.getSubImage(SHIELDS), shieldsDrawable);
        var world = new require.GameWorld(this.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
            scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict,
            function () {}, endGame, this.sounds);

        this.gameLoop.add(SHAKE_TUTORIAL, shaker.update.bind(shaker));
        this.gameLoop.add(COLLISION_TUTORIAL, world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = new require.EnergyStateMachine(this.stage, world, shieldsDrawable, shieldsUpSprite,
            shieldsDownSprite, energyBarDrawable, this.sounds);

        var touchable = {id: 'shields_up_tutorial', x: 0, y: 0, width: self.screenWidth, height: self.screenHeight};
        self.resizeRepo.add(touchable, function () {
            require.changeTouchable(touchable, 0, 0, self.screenWidth, self.screenHeight);
        });

        registerGameController();

        function removeEveryThing() {
            removeSkipStuff();
            removeTouchNHoldStuff();
            removeEnergyStuff();
            removeStarStuff();
            removeCommonGameLoopStuff();
            unregisterGameController();
        }

        var skipTxt, skipTouchable;
        function createSkipStuff() {
            function getY() {
                return require.calcScreenConst(self.screenHeight, 20, 3);
            }

            function getX() {
                return require.calcScreenConst(self.screenWidth, 8) * 6;
            }

            function getHeight() {
                return require.calcScreenConst(self.screenHeight, 8);
            }

            skipTouchable = {id: 'skip_tap', x: getWidthHalf(), y: getY() - getHeightSixteenth(),
                width: getWidthHalf(), height: getHeight()};
            self.tapController.add(skipTouchable, function () {
                self.sounds.play(CLICK);
                self.tapController.remove(skipTouchable);
                skipTxt.txt.alpha = 1;
                require.window.setTimeout(function () {
                    removeEveryThing();
                    endGame();
                }, 1000);
            });

            skipTxt = self.stage.getDrawableText(getX(), getY(), 3,
                self.messages.get(TUTORIAL_MSG_KEY, SKIP_MSG), 15, FONT, WHITE, 0, 0.5);
            self.stage.draw(skipTxt);

            self.resizeRepo.add(skipTxt, function () {
                require.changeCoords(skipTxt, getX(), getY());
                require.changeTouchable(skipTouchable, getWidthHalf(), getY() - getHeightSixteenth(), getWidthHalf(), getHeight());
            });

            return skipTxt;
        }
        function removeSkipStuff() {
            self.stage.remove(skipTxt);
            self.tapController.remove(skipTouchable);
        }
        createSkipStuff();

        function createFirstAsteroid() {
            function getAsteroidHeightHalf() {
                return require.calcScreenConst(self.stage.getSubImage(ASTEROID).height, 2);
            }

            function getAsteroidWidthHalf() {
                return require.calcScreenConst(self.stage.getSubImage(ASTEROID).width, 2);
            }

            var asteroid = self.stage.getDrawable(getWidthHalf() - getAsteroidWidthHalf(), - getAsteroidHeightHalf(), ASTEROID);
            trackedAsteroids[asteroid.id] = asteroid;
            self.stage.draw(asteroid);

            self.resizeRepo.add(asteroid, function () {
                require.changeCoords(asteroid, getWidthHalf() - getAsteroidWidthHalf(), - getAsteroidHeightHalf());
            });

            return asteroid;
        }
        function createTouchNHoldTxt() {

            var touch_txt = self.stage.getDrawableText(getWidthThreeQuarter(), getHeightThird(), 3,
                self.messages.get(TUTORIAL_MSG_KEY, TOUCH_AND_HOLD_MSG), 20, FONT, WHITE, require.Math.PI / 16, 1,
                    getWidthThird() * 2, 25);
            self.stage.draw(touch_txt);

            self.resizeRepo.add(touch_txt, function () {
                require.changeCoords(touch_txt, getWidthThreeQuarter(), getHeightThird());
            });

            function getX() {
                return require.calcScreenConst(self.screenWidth, 16, 3);
            }

            var raise_txt = self.stage.getDrawableText(getX(), getHeightHalf(), 3,
                self.messages.get(TUTORIAL_MSG_KEY, TO_RAISE_SHIELDS_MSG), 17, FONT, WHITE, - require.Math.PI / 16, 1, getWidthThird(),
                22);
            self.stage.draw(raise_txt);

            self.resizeRepo.add(raise_txt, function () {
                require.changeCoords(raise_txt, getX(), getHeightHalf());
            });

            return [touch_txt, raise_txt];
        }

        function get__4() {
            var value = require.calcScreenConst(self.screenHeight, 100);
            return  value > 0 ? value : 1;
        }

        function get__2() {
            var value = require.calcScreenConst(self.screenHeight, 200);
            return  value > 0 ? value : 1;
        }

        function get__1() {
            var value = require.calcScreenConst(self.screenHeight, 400);
            return  value > 0 ? value : 1;
        }

        var __4 = get__4();
        var __2 = get__2();
        var __1 = get__1();

        self.resizeRepo.add({id: 'move_stuff'}, function () {
            __4 = get__4();
            __2 = get__2();
            __1 = get__1();
        });

        function moveMyFirstAsteroids() {
            if (asteroid.y < getHeightQuarter()) {
                asteroid.y += __4;
            } else if (world.shieldsOn) {
                asteroid.y += __2;
            } else if (asteroid.y > getHeightQuarter()) {
                asteroid.y -= __2;
            }
            if (!self.stage.has(asteroid)) {
                removeTouchNHoldStuff();
                showEnergyTxtSubScene();
            }
        }

        var touchTxts = createTouchNHoldTxt();
        var asteroid = createFirstAsteroid();

        self.gameLoop.add(ASTEROID_MOVEMENT, moveMyFirstAsteroids);

        function removeTouchNHoldStuff() {
            if (touchTxts)
                touchTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove(ASTEROID_MOVEMENT);
            if (asteroid)
                self.stage.remove(asteroid); //double remove just in case
        }

        var drainTxt, shieldsEnergyDrawable, energyTxt, okButton, okButtonTxt, okTouchable, dialogBack;
        function showEnergyTxtSubScene() {
            function createEnergyTxt() {

                dialogBack = self.stage.drawFresh(getWidthHalf(), getHeightHalf(), BACKGROUND, 3);
                self.resizeRepo.add(dialogBack, function () {
                    require.changeCoords(dialogBack, getWidthHalf(), getHeightHalf());
                });

                drainTxt = self.stage.getDrawableText(getWidthHalf(), getHeightThird(), 3,
                    self.messages.get(TUTORIAL_MSG_KEY, DRAIN_ENERGY_MSG), 15, FONT, WHITE);
                self.stage.draw(drainTxt);
                self.resizeRepo.add(drainTxt, function () {
                    require.changeCoords(drainTxt, getWidthHalf(), getHeightThird());
                });

                shieldsEnergyDrawable = self.stage.animateFresh(getWidthHalf(), getHeightHalf(),
                    SHIELDS_UP_TUTORIAL, 90);
                self.resizeRepo.add(shieldsEnergyDrawable, function () {
                    require.changeCoords(shieldsEnergyDrawable, getWidthHalf(), getHeightHalf());
                });

                energyTxt = self.stage.getDrawableText(getWidthHalf(), getHeightThird() * 2, 3,
                    self.messages.get(TUTORIAL_MSG_KEY, NO_ENERGY_MSG), 15, FONT, WHITE);
                self.stage.draw(energyTxt);
                self.resizeRepo.add(energyTxt, function () {
                    require.changeCoords(getWidthHalf(), getHeightThird() * 2);
                });

                okButtonTxt = self.stage.getDrawableText(getWidthHalf(), getHeightSixteenth() * 13, 3,
                    self.messages.get(TUTORIAL_MSG_KEY, OK_MSG), 15, FONT, WHITE);
                self.stage.draw(okButtonTxt);
                okButton = self.stage.drawFresh(getWidthHalf(), getHeightSixteenth() * 13, BUTTON_PRIM);
                okTouchable = {id: 'ok_tap', x: okButton.getCornerX(), y: okButton.getCornerY(),
                    width: okButton.getWidth(), height: okButton.getHeight()};
                self.resizeRepo.add(okButton, function () {
                    require.changeCoords(okButton, getWidthHalf(), getHeightSixteenth() * 13);
                    require.changeCoords(okButtonTxt, getWidthHalf(), getHeightSixteenth() * 13);
                    require.changeTouchable(okTouchable, okButton.getCornerX(), okButton.getCornerY(),
                        okButton.getWidth(), okButton.getHeight());
                });

                self.tapController.add(okTouchable, function () {
                    self.sounds.play(CLICK);
                    self.tapController.remove(okTouchable);

                    okButton.img = self.stage.getSubImage(BUTTON_PRIM_ACTIVE);
                    okButtonTxt.txt.color = BLACK;
                    require.window.setTimeout(function () {
                        removeEnergyStuff();
                        registerGameController();
                        collectStarsSubScene();
                    }, 1500);
                });
            }
            unregisterGameController();
            createEnergyTxt();
        }

        function removeEnergyStuff() {
            if (drainTxt)
                self.stage.remove(drainTxt);
            if (shieldsEnergyDrawable)
                self.stage.remove(shieldsEnergyDrawable);
            if (energyTxt)
                self.stage.remove(energyTxt);
            if (okButton)
                self.stage.remove(okButton);
            if (okButtonTxt)
                self.stage.remove(okButtonTxt);
            if (okTouchable)
                self.tapController.remove(okTouchable);
            if (dialogBack)
                self.stage.remove(dialogBack);
        }

        var starTxts, star;
        function collectStarsSubScene() {
            function createFirstStar() {
                var starNum = require.range(1, 4);
                var starPath = STAR + starNum + '/' + STAR + starNum;

                function getStarHeightHalf() {
                    return require.calcScreenConst(self.stage.getSubImage(STAR_1).height, 2);
                }

                function getStarWidthHalf() {
                    return require.calcScreenConst(self.stage.getSubImage(STAR_1).height, 2);
                }

                var star = self.stage.animateFresh(getWidthHalf() - getStarWidthHalf(), - getStarHeightHalf(), starPath, 30);
                trackedStars[star.id] = star;
                self.stage.draw(star);

                self.resizeRepo.add(star, function () {
                    require.changeCoords(star, getWidthHalf() - getStarWidthHalf(), - getStarHeightHalf());
                });

                return star;
            }
            function createCollectTxt() {
                var collectTxt = self.stage.getDrawableText(getWidthThreeQuarter(), getHeightThird(), 3,
                    self.messages.get(TUTORIAL_MSG_KEY, COLLECT_STUFF_MSG), 20, FONT, WHITE, require.Math.PI / 16, 1, getWidthHalf(),
                    25);
                self.stage.draw(collectTxt);
                self.resizeRepo.add(collectTxt, function () {
                    require.changeCoords(collectTxt, getWidthThreeQuarter(), getHeightThird());
                });

                return [collectTxt];
            }

            function moveMyFirstStar() {
                if (star.y < getHeightQuarter()) {
                    star.y += __4;
                } else if (!world.shieldsOn) {
                    star.y += __1;
                } else if (star.y > getHeightQuarter()) {
                    star.y -= __2;
                }
                if (world.points < 1 && !self.stage.has(star)) {
                    star = createFirstStar();
                }
                if (!self.stage.has(star)) {
                    removeEveryThing();
                    endGame();
                }
            }

            starTxts = createCollectTxt();
            star = createFirstStar();

            self.gameLoop.add(STAR_MOVEMENT, moveMyFirstStar);
        }

        function removeStarStuff() {
            if (starTxts)
                starTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove(STAR_MOVEMENT);
            if (star)
                self.stage.remove(star);
        }

        function registerGameController() {
            self.gameController.add(touchable, energyStates.drainEnergy.bind(energyStates),
                energyStates.loadEnergy.bind(energyStates));
        }

        function unregisterGameController() {
            if (touchable)
                self.gameController.remove(touchable);
        }

        function removeCommonGameLoopStuff() {
            self.gameLoop.remove(SHAKE_TUTORIAL);
            self.gameLoop.remove(COLLISION_TUTORIAL);
        }

        function endGame() {
            self.next(nextScene);
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        this.resizeBus.remove(IN_GAME_TUTORIAL_SCENE);
        delete this.resizeRepo;
        delete this.screenWidth;
        delete this.screenHeight;
        delete this.resizeShaker;

        nextScene();
    };

    InGameTutorial.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        require.GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);
        this.resizeRepo.call();
        this.resizeShaker();
    };

    return InGameTutorial;
})({
    Math: Math,
    ScreenShaker: ScreenShaker,
    Odometer: Odometer,
    CollectView: CollectView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    CanvasCollisionDetector: CanvasCollisionDetector,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    window: window,
    range: range,
    calcScreenConst: calcScreenConst,
    Repository: Repository,
    GameStuffHelper: GameStuffHelper,
    changeCoords: changeCoords,
    changePath: changePath,
    changeTouchable: changeTouchable
});