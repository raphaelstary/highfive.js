var InGameTutorial = (function (require) {
    "use strict";

    function InGameTutorial(stage, sceneStorage, gameLoop, gameController, messages, tapController, atlas, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
        this.messages = messages;
        this.tapController = tapController;
        this.atlas = atlas;
        this.resizeBus = resizeBus;
    }

    InGameTutorial.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add('in_game_tutorial', this.resize.bind(this));
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
                (this.sceneStorage.shields = this.stage.getDrawable(getWidthHalf(), get__400(), 'shields')),
            energyBarDrawable = this.sceneStorage.energyBar,
            lifeDrawablesDict = this.sceneStorage.lives,
            countDrawables = this.sceneStorage.counts,
            fireDrawable = this.sceneStorage.fire,
            speedStripes = this.sceneStorage.speedStripes,
            shieldsUpSprite =
                this.sceneStorage.shieldsUp || this.stage.getSprite('shields-up-anim/shields_up', 6, false),
            shieldsDownSprite =
                this.sceneStorage.shieldsDown || this.stage.getSprite('shields-down-anim/shields_down', 6, false);

        var shaker = new require.ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1],
            lifeDrawablesDict[2], lifeDrawablesDict[3], fireDrawable]);
        this.resizeShaker = shaker.resize.bind(shaker);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(function (wrapper) {
            shaker.add(wrapper.drawable);
        });

        var KEN_PIXEL = 'KenPixel';
        var white = '#fff';

        var trackedAsteroids = {};
        var trackedStars = {};

        var scoreDisplay = new require.Odometer(new require.OdometerView(this.stage, countDrawables));
        var collectAnimator = new require.CollectView(this.stage, shipDrawable, 3);

        var scoreAnimator = new require.ScoreView(this.stage, self.screenWidth, self.screenHeight);
        self.resizeRepo.add({id: 'score_view_tutorial'}, function () {
            scoreAnimator.resize(self.screenWidth, self.screenHeight);
        });

        var shipCollision = new require.CanvasCollisionDetector(this.atlas, this.stage.getSubImage('ship'),
            shipDrawable);
        var shieldsCollision = new require.CanvasCollisionDetector(this.atlas, this.stage.getSubImage('shield3'),
            shieldsDrawable);
        var world = new require.GameWorld(this.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
            scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict,
            function () {}, endGame);

        this.gameLoop.add('shake_tutorial', shaker.update.bind(shaker));
        this.gameLoop.add('collisions_tutorial', world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = new require.EnergyStateMachine(this.stage, world, shieldsDrawable, shieldsUpSprite,
            shieldsDownSprite, energyBarDrawable);

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
                self.tapController.remove(skipTouchable);
                skipTxt.txt.alpha = 1;
                require.window.setTimeout(function () {
                    removeEveryThing();
                    endGame();
                }, 1000);
            });
            skipTxt = self.stage.getDrawableText(getX(), getY(), 3,
                self.messages.get('tutorial', 'skip'), 15, 'KenPixel', '#fff', 0, 0.5);
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
            var asteroidName = 'asteroid1';

            function getAsteroidHeightHalf() {
                return require.calcScreenConst(self.stage.getSubImage(asteroidName).height, 2);
            }

            function getAsteroidWidthHalf() {
                return require.calcScreenConst(self.stage.getSubImage(asteroidName).width, 2);
            }

            var asteroid = self.stage.getDrawable(getWidthHalf() - getAsteroidWidthHalf(), - getAsteroidHeightHalf(), asteroidName);
            trackedAsteroids[asteroid.id] = asteroid;
            self.stage.draw(asteroid);

            self.resizeRepo.add(asteroid, function () {
                require.changeCoords(asteroid, getWidthHalf() - getAsteroidWidthHalf(), - getAsteroidHeightHalf());
            });

            return asteroid;
        }
        function createTouchNHoldTxt() {

            var touch_txt = self.stage.getDrawableText(getWidthThreeQuarter(), getHeightThird(), 3,
                self.messages.get('tutorial', 'touch_and_hold'), 20, KEN_PIXEL, white, Math.PI / 16, 1, getWidthThird() * 2,
                25);
            self.stage.draw(touch_txt);

            self.resizeRepo.add(touch_txt, function () {
                require.changeCoords(touch_txt, getWidthThreeQuarter(), getHeightThird());
            });

            function getX() {
                return require.calcScreenConst(self.screenWidth, 16, 3);
            }

            var raise_txt = self.stage.getDrawableText(getX(), getHeightHalf(), 3,
                self.messages.get('tutorial', 'to_raise_shields'), 17, KEN_PIXEL, white, - Math.PI / 16, 1, getWidthThird(),
                22);
            self.stage.draw(raise_txt);

            self.resizeRepo.add(raise_txt, function () {
                require.changeCoords(raise_txt, getX(), getHeightHalf());
            });

            return [touch_txt, raise_txt];
        }

        function get__4() {
            return require.calcScreenConst(self.screenHeight, 100);
        }

        function get__2() {
            return require.calcScreenConst(self.screenHeight, 200);
        }

        function get__1() {
            return require.calcScreenConst(self.screenHeight, 400);
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
        self.gameLoop.add('asteroid_movement', moveMyFirstAsteroids);

        function removeTouchNHoldStuff() {
            if (touchTxts)
                touchTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove('asteroid_movement');
            if (asteroid)
                self.stage.remove(asteroid); //double remove just in case
        }

        var drainTxt, shieldsEnergyDrawable, energyTxt, okButton, okTouchable, dialogBack;
        function showEnergyTxtSubScene() {
            function createEnergyTxt() {
                dialogBack = self.stage.drawFresh(getWidthHalf(), getHeightHalf(), 'background', 3);
                self.resizeRepo.add(dialogBack, function () {
                    require.changeCoords(dialogBack, getWidthHalf(), getHeightHalf());
                });

                drainTxt = self.stage.getDrawableText(getWidthHalf(), getHeightThird(), 3,
                    self.messages.get('tutorial', 'drain_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(drainTxt);
                self.resizeRepo.add(drainTxt, function () {
                    require.changeCoords(drainTxt, getWidthHalf(), getHeightThird());
                });

                shieldsEnergyDrawable = self.stage.animateFresh(getWidthHalf(), getHeightHalf(),
                    'shields_energy-anim/shields_energy', 60);
                self.resizeRepo.add(shieldsEnergyDrawable, function () {
                    require.changeCoords(shieldsEnergyDrawable, getWidthHalf(), getHeightHalf());
                });

                energyTxt = self.stage.getDrawableText(getWidthHalf(), getHeightThird() * 2, 3,
                    self.messages.get('tutorial', 'no_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(energyTxt);
                self.resizeRepo.add(energyTxt, function () {
                    require.changeCoords(getWidthHalf(), getHeightThird() * 2);
                });

                okButton = self.stage.drawFresh(getWidthHalf(), getHeightSixteenth() * 13, 'ok');
                okTouchable = {id: 'ok_tap', x: okButton.getCornerX(), y: okButton.getCornerY(),
                    width: okButton.getWidth(), height: okButton.getHeight()};
                self.resizeRepo.add(okButton, function () {
                    require.changeCoords(okButton, getWidthHalf(), getHeightSixteenth() * 13);
                    require.changeTouchable(okTouchable, okButton.getCornerX(), okButton.getCornerY(),
                        okButton.getWidth(), okButton.getHeight());
                });

                self.tapController.add(okTouchable, function () {
                    self.tapController.remove(okTouchable);
                    okButton.img = self.stage.getSubImage('ok-active');
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
            if (okTouchable)
                self.tapController.remove(okTouchable);
            if (dialogBack)
                self.stage.remove(dialogBack);
        }

        var starTxts, star;
        function collectStarsSubScene() {
            function createFirstStar() {
                var starNum = require.range(1, 4);
                var starPath = 'star' + starNum + '-anim/star' + starNum;

                function getStarHeightHalf() {
                    return require.calcScreenConst(self.stage.getSubImage('star1-anim/star1_0000').height, 2);
                }

                function getStarWidthHalf() {
                    return require.calcScreenConst(self.stage.getSubImage('star1-anim/star1_0000').height, 2);
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
                    self.messages.get('tutorial', 'collect_stuff'), 20, KEN_PIXEL, white, Math.PI / 16, 1, getWidthHalf(),
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
            self.gameLoop.add('star_movement', moveMyFirstStar);
        }

        function removeStarStuff() {
            if (starTxts)
                starTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove('star_movement');
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
            self.gameLoop.remove('shake_tutorial');
            self.gameLoop.remove('collisions_tutorial');
        }

        function endGame() {
            self.next(nextScene);
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        this.resizeBus.remove('in_game_tutorial');
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