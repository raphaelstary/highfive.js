var App = (function (require) {
    "use strict";
//    var DEBUG_START_IMMEDIATELY = false;

    function App(screen, screenCtx, requestAnimationFrame, resizeBus, screenInput, gameController) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
        this.gameController = gameController;
        this.showTutorial = true;
    }

    App.prototype.start = function (windowWidth, windowHeight) {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene(windowWidth, windowHeight);
    };

    App.prototype._loadingScene = function (windowWidth, windowHeight) {
        // show loading screen, load binary resources

        var resourceLoader = new require.ResourceLoader(),
            atlas = resourceLoader.addImage('gfx/atlas.png'),
            atlasInfo = resourceLoader.addJSON('data/atlas.json'),
            initialScreen = new require.SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function () {

            self.resizeBus.remove('initial_screen');
            var firstSceneFn;

//            if (DEBUG_START_IMMEDIATELY) {
//                firstSceneFn = self._preGameScene.bind(self);
//            } else {
            firstSceneFn = self._introScene.bind(self);
//            }

            self._initCommonSceneStuff(atlas, atlasInfo, windowWidth, firstSceneFn);
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (atlas, atlasInfo, windowWidth, firstScene) {
        var atlasMapper = new require.AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);

        var stage = new require.StageDirector(atlasMapper, new require.MotionDirector(new require.MotionStudio()),
            new require.AnimationDirector(new require.AnimationStudio()), new require.Renderer(this.screen, this.screenCtx, atlas));

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        firstScene(stage);


    };

    App.prototype._introScene = function (stage) {

        var firstBg = stage.drawFresh(320 / 2, 480 / 2, 'background', 0);
        var firstBgPath = stage.getPath(320 / 2, 480 / 2, 320 / 2, 480 / 2 - 480, 120, Transition.LINEAR);

        var scrollingBackGround = stage.getDrawable(320 / 2, 480 / 2 + 480, 'background', 0);
        var scrollingBgPath = stage.getPath(320 / 2, 480 / 2 + 480, 320 / 2, 480 / 2, 120, Transition.LINEAR);

        var self = this;

        var speedY = 0; // 600

        var speedDrawableOne = stage.getDrawable(320 / 4, speedY, 'speed', 1);
        var speedDrawableTwo = stage.getDrawable(320 / 8 * 7, speedY - 100, 'speed', 1);
        var speedDrawableThree = stage.getDrawable(320 / 16, speedY - 200, 'speed', 1);
        var speedDrawableFour = stage.getDrawable(320 / 16 * 7, speedY - 300, 'speed', 1);
        var speedDrawableFive = stage.getDrawable(320 / 16, speedY - 400, 'speed', 1);
        var speedDrawableSix = stage.getDrawable(320 / 3 * 2, speedY - 450, 'speed', 1);

        var x = 320 / 2,
            y = 480 + 20,
            yEnd = -20;

        var letsplayIO = stage.getDrawable(x, y + 50, 'letsplayIO', 2);
        var letsplayIOPath = stage.getPath(x, y + 50, x, yEnd - 50, 120, Transition.EASE_OUT_IN_SIN);

        var presentsDrawable = stage.getDrawable(x, y, 'presents', 2);
        var presentsPath = stage.getPath(x, y + 100, x, 30, 120, Transition.EASE_OUT_IN_SIN);

        var logoYEnd = 480 / 6;
        var logoDrawable = stage.animateFresh(x, y, 'logo-anim/logo', 44);
        var logoInPath = stage.getPath(x, y, x, logoYEnd, 120, Transition.EASE_OUT_QUAD);

        var lastY = letsplayIO.y;
        var speedos = [speedDrawableOne, speedDrawableTwo, speedDrawableThree, speedDrawableFour, speedDrawableFive, speedDrawableSix];
        speedos.forEach(function (speeeed) {
            stage.draw(speeeed);
        });

        var hasNotStarted = true;
        this.gameLoop.add('z_parallax', function () {
            var delta = lastY - letsplayIO.y;
            lastY = letsplayIO.y;

            speedos.forEach(function (speeeeeeed) {
                speeeeeeed.y += 10;

                speeeeeeed.y -= delta * 2;

                if (speeeeeeed.y > 600) {
                    stage.remove(speeeeeeed);
                }
            });

            if (speedDrawableOne.y >= 480 && hasNotStarted) {
                hasNotStarted = false;

                stage.move(firstBg, firstBgPath, function () {
                    stage.remove(firstBg);
                });
                stage.move(scrollingBackGround, scrollingBgPath, function () {
                    scrollingBackGround.y = 480 / 2;
                });

                stage.move(letsplayIO, letsplayIOPath, function () {
                    stage.remove(letsplayIO);
                });

                stage.move(presentsDrawable, presentsPath, function () {
                    stage.remove(presentsDrawable);
                });

                var speedStripes;
                stage.moveLater({item: logoDrawable, path: logoInPath, ready: function () {

                    self.gameLoop.remove('z_parallax');
                    self._preGameScene(stage, logoDrawable, speedStripes);

                }}, 90, function () {
                    var delay = 30;
                    speedStripes = self._showSpeedStripes(stage, delay);
                });
            }
        });
    };

    App.prototype._showSpeedStripes = function (stage, delay) {
        var speedStripes = [];

        var self = this;

        speedStripes.push(self._drawSpeed(stage, 320 / 4, 0 + delay));
        speedStripes.push(self._drawSpeed(stage, 320 / 3 * 2, 34 + delay));
        speedStripes.push(self._drawSpeed(stage, 320 / 8 * 7, 8 + delay));
        speedStripes.push(self._drawSpeed(stage, 320 / 16 * 7, 24 + delay));
        speedStripes.push(self._drawSpeed(stage, 320 / 16, 16 + delay));

        return speedStripes;
    };

    App.prototype._drawSpeed = function (stage, x, delay) {
        return stage.moveFreshLater(x, -108 / 2, 'speed', x, 480 + 108 / 2, 30, Transition.LINEAR, delay, true);
    };

    App.prototype._preGameScene = function (stage, logoDrawable, speedStripes) {
        var self = this;

        var shipStartY = 600;
        var shipEndY = 480 / 8 * 5;
        var shipDrawable = stage.drawFresh(320 / 2, shipStartY, 'ship');
        var shipInPath = stage.getPath(320 / 2, shipStartY, 320 / 2, shipEndY, 60, Transition.EASE_IN_QUAD);

        var fireDrawable = stage.animateFresh(320 / 2, shipStartY, 'fire-anim/fire', 8);
        var tapDrawable;
        var pressPlay = stage.getDrawable(320 / 2, 480 / 3, 'play');
        var touchable = {id: 'ready_tap', x: 0, y: 0, width: 320, height: 480};
        stage.move(shipDrawable, shipInPath, function () {
            shipDrawable.y = shipEndY;
            shieldsAnimation();
            tapDrawable = stage.animateFresh(320 / 16 * 9, 480 / 8 * 7, 'tap-anim/tap', 36);
            stage.draw(pressPlay);


            self.tapController.add(touchable, function () {
                var pressPlaySprite = stage.getSprite('press-play-anim/press_play', 16);
                stage.animate(pressPlay, pressPlaySprite, function () {
                    endOfScreen();
                });

            });

        });
        stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        var shieldsDownSprite = stage.getSprite('shields-down-anim/shields_down', 6, false);
        var shieldsUpSprite = stage.getSprite('shields-up-anim/shields_up', 6, false);
        var shieldsDrawable = stage.getDrawable(320 / 2, shipEndY, 'shields', 2);

        //------------------------------- DEBUG_ONLY start
//        if (DEBUG_START_IMMEDIATELY) {
//            stage.remove(pressPlay);
//            self.tapController.remove(touchable);
//            stage.drawFresh(320 / 2, 480 / 2, 'background', 0);
//            var stripes = this._showSpeedStripes(stage, 0);
//            this._startingPositionScene(stage, shipDrawable, fireDrawable, shieldsDrawable,
//                shieldsUpSprite, shieldsDownSprite, stripes);
//
//            return;
//        }
        //------------------------------- DEBUG_ONLY end

        var startTimer = 10;
        var doTheShields = true;

        function shieldsAnimation() {

            stage.animateLater({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = stage.getSubImage('shield3');
                stage.animateLater({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    stage.remove(shieldsDrawable);
                    startTimer = 20;
                    if (doTheShields) {
                        shieldsAnimation();
                    }
                }}, 28)
            }}, startTimer);
        }

        // end of screen

        function endOfScreen() {
            stage.remove(pressPlay);
            // end event
            self.tapController.remove(touchable);

            var logoOut = stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
            stage.move(logoDrawable, logoOut, function () {
                stage.remove(logoDrawable);
            });
            var tapOut = stage.getPath(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
            stage.move(tapDrawable, tapOut, function () {
                stage.remove(tapDrawable);
            });

            var dockShipToGamePosition = stage.getPath(shipDrawable.x, shipDrawable.y,
                shipDrawable.x, 400, 30, Transition.EASE_IN_OUT_EXPO);

            doTheShields = false;
            stage.remove(shieldsDrawable);

            stage.move(shipDrawable, dockShipToGamePosition, function () {
                // next scene
                self._startingPositionScene(stage, shipDrawable,
                    fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, speedStripes);
            });

            stage.move(fireDrawable, dockShipToGamePosition);

        }
    };

    App.prototype._startGameLoop = function (stage) {
        this.gameLoop = new require.GameLoop(this.requestAnimationFrame);
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._tutorialScene = function (stage, nxtSceneFn) {
        var self = this;
        var offSet = 480 / 4 / 2;
        var touchHoldDrawable = stage.animateFresh(-320, 480 / 4 - offSet, 'touch_hold-anim/touch_hold', 60);
        var crushAsteroidsDrawable = stage.animateFresh(-320, 480 / 2 - offSet, 'crush_asteroids-anim/crush_asteroids', 45);
        var shieldsEnergyDrawable = stage.animateFresh(-320, 480 / 4 * 3 - offSet, 'shields_energy-anim/shields_energy', 60);
        var collectBonusDrawable = stage.animateFresh(-320, 480 - offSet, 'collect_bonus-anim/collect_bonus', 45);
        var pathIn = stage.getPath(-320, 0, 320 / 2, 0, 60, Transition.EASE_OUT_BOUNCE);

        stage.move(touchHoldDrawable, pathIn);
        stage.moveLater({item: crushAsteroidsDrawable, path: pathIn}, 5);
        stage.moveLater({item: shieldsEnergyDrawable, path: pathIn}, 10);
        stage.moveLater({item: collectBonusDrawable, path: pathIn, ready: function () {
            var pressPlay = stage.getDrawable(320 / 2, 480 / 4 * 3, 'play');
            stage.draw(pressPlay);
            var touchable = {id: 'play_tap', x: pressPlay.getCornerX(), y: pressPlay.getCornerY(),
                width: pressPlay.getEndX() - pressPlay.getCornerX(),
                height: pressPlay.getEndY() - pressPlay.getCornerY()};

            self.tapController.add(touchable, function () {
                // end event
                self.tapController.remove(touchable);

                var pressPlaySprite = stage.getSprite('press-play-anim/press_play', 16, false);
                stage.animate(pressPlay, pressPlaySprite, function () {

                    stage.remove(pressPlay);

                    var pathOut = stage.getPath(320 / 2, 0, 320 * 2, 0, 60, Transition.EASE_IN_EXPO);

                    stage.move(touchHoldDrawable, pathOut);
                    stage.moveLater({item: crushAsteroidsDrawable, path: pathOut}, 5);
                    stage.moveLater({item: shieldsEnergyDrawable, path: pathOut}, 10);
                    stage.moveLater({item: collectBonusDrawable, path: pathOut, ready: function () {
                        stage.remove(touchHoldDrawable);
                        stage.remove(crushAsteroidsDrawable);
                        stage.remove(shieldsEnergyDrawable);
                        stage.remove(collectBonusDrawable);

                        nxtSceneFn();
                    }}, 15);
                });
            });

        }}, 15);

        this.showTutorial = false;
    };

    App.prototype._getReadyScene = function (stage, nxtSceneFn) {

        if (this.showTutorial) {
            this._tutorialScene(stage, extracted);
        } else {
            extracted();
        }

        function extracted() {
            var readyDrawable = stage.getDrawable(-160, 480 / 3, 'ready-anim/get_ready_0010');

            var readyPath = stage.getPath(-160, 480 / 3, 320 + 160, 480 / 3, 90, Transition.EASE_OUT_IN_SIN);

            stage.move(readyDrawable, readyPath, function () {

                // create end event method to end scene, this is endGetReadyScene
                stage.remove(readyDrawable);

                nxtSceneFn();
            });
        }
    };

    App.prototype._startingPositionScene = function (stage, shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, speedStripes) {

        var self = this;
        var zero = 'num/numeral0';
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;
        var yTop = 480 / 20;
        var yBottom = yTop * 19;
        var lifeX = 320 / 10;
        var lifeOneDrawable = stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX, yTop, speed, spacing, 20);
        var lifeTwoDrawable = stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX + 40, yTop, speed, spacing, 15);
        var lifeThreeDrawable = stage.moveFreshLater(lifeX - lifeX * 2, yTop, 'playerlife', lifeX + 80, yTop, speed, spacing, 10);
        var energyX = 320 / 5 + 5;
        var energyBarDrawable = stage.moveFresh(energyX - energyX * 2, yBottom, 'energy_bar_full', energyX, yBottom, speed, spacing);
        var digitX = 320 / 3 * 2 + 10;
        var firstDigit = digitX + 75;
        var firstDigitDrawable = stage.moveFreshLater(firstDigit + 60, yTop, zero, firstDigit, yTop, speed, spacing, 10);
        var secondDigit = digitX + 50;
        var secondDigitDrawable = stage.moveFreshLater(secondDigit + 60, yTop, zero, secondDigit, yTop, speed, spacing, 13);
        var thirdDigit = digitX + 25;
        var thirdDigitDrawable = stage.moveFreshLater(thirdDigit + 60, yTop, zero, thirdDigit, yTop, speed, spacing, 17);
        var fourthDigitDrawable = stage.moveFreshLater(digitX + 60, yTop, zero, digitX, yTop, speed, spacing, 12, false, function () {
            self._getReadyScene(stage, nxtScene);
        });

        function nxtScene() {
            self._playGameScene(stage, shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                energyBarDrawable, lifeOneDrawable, lifeTwoDrawable, lifeThreeDrawable, firstDigitDrawable, secondDigitDrawable,
                thirdDigitDrawable, fourthDigitDrawable, fireDrawable, speedStripes);
        }
    };

    App.prototype._drawStar = function (stage, imgName, x, speed) {
        var star = stage.animateFresh(x, -108 / 2, imgName, 30);
        stage.move(star, stage.getPath(x, -108 / 2, x, 480 + 108 / 2, speed, Transition.LINEAR));

        return star;
    };

    App.prototype._drawAsteroid = function (stage, imgName, x, speed) {
        return stage.moveFresh(x, -108 / 2, imgName, x, 480 + 108 / 2, speed, Transition.LINEAR);
    };

    App.prototype._playGameScene = function (stage, shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, energyBarDrawable, lifeOneDrawable, lifeTwoDrawable, lifeThreeDrawable, firstDigitDrawable, secondDigitDrawable, thirdDigitDrawable, fourthDigitDrawable, fireDrawable, speedStripes) {
        var shaker = [shipDrawable, shieldsDrawable, energyBarDrawable, lifeOneDrawable, lifeTwoDrawable, lifeThreeDrawable, firstDigitDrawable, secondDigitDrawable, thirdDigitDrawable, fourthDigitDrawable, fireDrawable];
        speedStripes.forEach(function (stripe) {
            shaker.push(stripe);
        });
        var shaking = false;
        var smallShaking = false;
        var bigShaking = false;

        var shieldsOn = false; //part of global game state
        var lives = 3; //3; //part of global game state
        var initialLives = 3; // needed for right render stuff after collect or similar
        var points = 0; //part of global game state

        var lifeDrawables = {1: lifeOneDrawable, 2: lifeTwoDrawable, 3: lifeThreeDrawable};

        // level difficulty
        var maxTimeToFirst = 100;
        var percentageForAsteroid = 66;

        var asteroidSpeed = 90;
        var pauseAfterAsteroid = 30;
        var maxTimeToNextAfterAsteroid = 100;

        var starSpeed = 90;
        var pauseAfterStar = 20;
        var maxTimeToNextAfterStar = 100;

        // -------------------

        var counter = 0;
        // im interval 0 - 100 kommt ein element
        var nextCount = range(0, maxTimeToFirst);

        var trackedAsteroids = {};
        var trackedStars = {};
        var self = this;

        function generateLevel() {
            counter += 1;
            if (counter <= nextCount) {
                return;
            }

            counter = 0;

            var drawable;
            // 2/3 asteroid, 1/3 star
            if (range(1, 100) <= percentageForAsteroid) {
                drawable = self._drawAsteroid(stage, 'asteroid' + range(1, 4), range(320 / 5, 4 * 320 / 5), asteroidSpeed);
                nextCount = pauseAfterAsteroid + range(0, maxTimeToNextAfterAsteroid);

                trackedAsteroids[drawable.id] = drawable;
            } else {
                var starNum = range(1, 4);
                var starPath = 'star' + starNum + '-anim/star' + starNum;
                drawable = self._drawStar(stage, starPath, range(320 / 3, 2 * 320 / 3), starSpeed);
                nextCount = pauseAfterStar + range(0, maxTimeToNextAfterStar);

                trackedStars[drawable.id] = drawable;
            }
//            shaker.push(drawable);
        }

        var elemHitsShieldsSprite;
        var shieldsGetHitSprite;

        function initShieldsHitRenderStuff() {
            elemHitsShieldsSprite = stage.getSprite('shield-hit-anim/shield_hit', 12, false);
            shieldsGetHitSprite = stage.getSprite('shiels-hit-anim/shields_hit', 10, false); //TODO change sprite name
        }

        initShieldsHitRenderStuff();

        var shipHullHitSprite;
        var dumpLifeSprite;

        function initShipHullHitRenderStuff() {
            shipHullHitSprite = stage.getSprite('ship-hit-anim/ship_hit', 30, false);
            dumpLifeSprite = stage.getSprite('lost-life-anim/lost_life', 20, false);
        }

        initShipHullHitRenderStuff();

        function collisions() {
            var key;
            for (key in trackedAsteroids) {
                if (!trackedAsteroids.hasOwnProperty(key)) {
                    continue;
                }
                var asteroid = trackedAsteroids[key];

                if (shieldsOn && needPreciseCollisionDetectionForShields(asteroid) && isShieldsHit(asteroid)) {
                    stage.animate(shieldsDrawable, shieldsGetHitSprite, function () {
                        if (shieldsOn) {
                            shieldsDrawable.img = stage.getSubImage('shield3');
                        } else {
                            stage.remove(shieldsDrawable);
                        }
                    });
                    (function (asteroid) {
                        stage.remove(asteroid);
                        stage.animate(asteroid, elemHitsShieldsSprite, function () {
                            stage.remove(asteroid);
                        })
                    })(asteroid);
                    smallScreenShake();

                    delete trackedAsteroids[key];
                    continue;
                }

                if (needPreciseCollisionDetection(asteroid) && isHit(asteroid)) {
                    stage.remove(asteroid);
                    delete trackedAsteroids[key];

                    shipGotHit();
                    bigScreenShake();

                    if (lives <= 0) {
                        endGame();
                    }
//                    continue;
                }
            }

            for (key in trackedStars) {
                if (!trackedStars.hasOwnProperty(key)) {
                    continue;
                }
                var star = trackedStars[key];

                if (shieldsOn && needPreciseCollisionDetectionForShields(star) && isShieldsHit(star)) {
                    stage.animate(shieldsDrawable, shieldsGetHitSprite, function () {
                        if (shieldsOn) {
                            shieldsDrawable.img = stage.getSubImage('shield3');
                        } else {
                            stage.remove(shieldsDrawable);
                        }
                    });
                    (function (star) {
                        stage.remove(star);
                        stage.animate(star, elemHitsShieldsSprite, function () {
                            stage.remove(star);
                        })
                    })(star);

                    delete trackedStars[key];
                    continue;
                }

                if (needPreciseCollisionDetection(star) && isHit(star)) {
                    collectStar();
                    showScoredPoints(star.x, star.y);
                    increaseTotalScore(10);

                    stage.remove(star);
                    delete trackedStars[key];
//                    continue;
                }
            }
        }

        function shipGotHit() {
            var currentLife = lives;
            stage.animate(lifeDrawables[currentLife], dumpLifeSprite, function () {
                stage.remove(lifeDrawables[currentLife]);
                delete lifeDrawables[currentLife];
            });

            if (--lives > 0) {
                stage.animate(shipDrawable, shipHullHitSprite, function () {
                    if (lives == initialLives - 1) {
                        shipDrawable.img = stage.getSubImage('damaged-ship2');
                    } else if (lives == initialLives - 2) {
                        shipDrawable.img = stage.getSubImage('damaged-ship3');
                    } else {
                        shipDrawable.img = stage.getSubImage('ship');
                    }
                });
            }
        }


        var scoredPointsSprite, scoredPointsDrawable;

        function initScoredPointsRenderStuff() {
            scoredPointsSprite = stage.getSprite('score-10-anim/score_10', 20, false);
            scoredPointsDrawable = stage.getDrawable(0, 0, 'score-10-anim/score_10_0000', 3);
        }

        initScoredPointsRenderStuff();

        function showScoredPoints(x, y) {
            var yOffSet = 50;
            scoredPointsDrawable.x = x;
            scoredPointsDrawable.y = y - yOffSet;
            stage.animate(scoredPointsDrawable, scoredPointsSprite, function () {
                stage.remove(scoredPointsDrawable);
            });
        }

        var sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0;
        var countSprites;
        var countDrawables;
        var countStatics;

        function initIncreaseTotalScoreRenderStuff() {

            sprite0_1 = stage.getSprite('0_1-anim/0_1', 15, false);
            sprite1_2 = stage.getSprite('1_2-anim/1_2', 15, false);
            sprite2_3 = stage.getSprite('2_3-anim/2_3', 15, false);
            sprite3_4 = stage.getSprite('3_4-anim/3_4', 15, false);
            sprite4_5 = stage.getSprite('4_5-anim/4_5', 15, false);
            sprite5_6 = stage.getSprite('5_6-anim/5_6', 15, false);
            sprite6_7 = stage.getSprite('6_7-anim/6_7', 15, false);
            sprite7_8 = stage.getSprite('7_8-anim/7_8', 15, false);
            sprite8_9 = stage.getSprite('8_9-anim/8_9', 15, false);
            sprite9_0 = stage.getSprite('9_0-anim/9_0', 15, false);
            countSprites = [sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0];
            countDrawables = [firstDigitDrawable, secondDigitDrawable, thirdDigitDrawable, fourthDigitDrawable];
            countStatics = [stage.getSubImage('num/numeral0'), stage.getSubImage('num/numeral1'), stage.getSubImage('num/numeral2'),
                stage.getSubImage('num/numeral3'), stage.getSubImage('num/numeral4'), stage.getSubImage('num/numeral5'),
                stage.getSubImage('num/numeral6'), stage.getSubImage('num/numeral7'), stage.getSubImage('num/numeral8'),
                stage.getSubImage('num/numeral9')];
        }

        initIncreaseTotalScoreRenderStuff();

        var totalScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        function increaseTotalScore(score) {
            points += score;
            var scoreString = score.toString();

            var u = 0,
                overflow = 0;

            for (var i = scoreString.length - 1; i > -1; i--) {
                addDigit(parseInt(scoreString[i], 10));
            }
            while (overflow > 0) {
                addDigit(0);
            }

            function addDigit(intToAdd) {
                var currentDigit = totalScore[u];
                var tmpAmount = currentDigit + intToAdd + overflow;
                overflow = Math.floor(tmpAmount / 10);
                var newDigit = tmpAmount % 10;

                var delta = tmpAmount - currentDigit;
                var currentDrawable = countDrawables[u];
                for (var v = 0; v < delta; v++) {
                    var currentSprite = countSprites[(currentDigit + v) % 10];
                    (function (currentDrawable, currentDigit, v) {
                        stage.animate(currentDrawable, currentSprite, function () {
                            currentDrawable.img = countStatics[(currentDigit + 1 + v) % 10];
                        })
                    })(currentDrawable, currentDigit, v);
                    if ((currentDigit + v) % 10 === newDigit) {
                        break;
                    }
                }

                totalScore[u] = newDigit;

                u++;
            }
        }


        var collectSprite;

        function initCollectRenderStuff() {
            collectSprite = stage.getSprite('collect-star-anim/collect_star', 30, false);
        }

        initCollectRenderStuff();

        function collectStar() {
            stage.animate(shipDrawable, collectSprite, function () {
                if (lives == initialLives - 1) {
                    shipDrawable.img = stage.getSubImage('damaged-ship2');
                } else if (lives == initialLives - 2) {
                    shipDrawable.img = stage.getSubImage('damaged-ship3');
                } else {
                    shipDrawable.img = stage.getSubImage('ship');
                }
            });
        }

        function needPreciseCollisionDetection(element) {
            return shipDrawable.getCornerY() <= element.getEndY();
        }

        function needPreciseCollisionDetectionForShields(element) {
            return shieldsDrawable.getCornerY() <= element.getEndY();
        }

        var collisionCanvas = document.createElement('canvas');
        var ccCtx = collisionCanvas.getContext('2d');
        var shipStaticImg = stage.getSubImage('ship');
        var shieldStatic = stage.getSubImage("shield3");
        collisionCanvas.width = shieldStatic.width; //shipStaticImg.width;
        collisionCanvas.height = shieldStatic.height; //shipStaticImg.height;
        var collisionCanvasWidth = shieldStatic.width;
        var collisionCanvasHeight = shieldStatic.height;

        function getStaticShipCornerX() {
            return shipDrawable.x - shipStaticImg.width / 2;
        }

        function getStaticShipCornerY() {
            return shipDrawable.y - shipStaticImg.height / 2;
        }

        function isHit(element) {
            ccCtx.clearRect(0, 0, collisionCanvasWidth, collisionCanvasHeight);

            var shipImg = shipStaticImg;
            var elemImg = element.img;

            ccCtx.drawImage(stage.renderer.atlas, shipImg.x, shipImg.y, shipImg.width, shipImg.height, 0, 0, shipImg.width, shipImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - getStaticShipCornerX();
            var y = element.getCornerY() - getStaticShipCornerY();
            ccCtx.drawImage(stage.renderer.atlas, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width, elemImg.height);

            ccCtx.restore();

            var rawPixelData = ccCtx.getImageData(0, 0, x + elemImg.width, y + elemImg.height).data;

            for (var i = 0; i < rawPixelData.length; i += 4) {
                var alphaValue = rawPixelData[i + 3];
                if (alphaValue != 0) {
                    return true;
                }
            }
            return false;
        }

        function isShieldsHit(element) {
            ccCtx.clearRect(0, 0, collisionCanvasWidth, collisionCanvasHeight);

            var shieldsImg = shieldsDrawable.img;
            var elemImg = element.img;

            ccCtx.drawImage(stage.renderer.atlas, shieldsImg.x, shieldsImg.y, shieldsImg.width, shieldsImg.height, 0, 0, shieldsImg.width, shieldsImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - shieldsDrawable.getCornerX();
            var y = element.getCornerY() - shieldsDrawable.getCornerY();
            ccCtx.drawImage(stage.renderer.atlas, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width, elemImg.height);

            ccCtx.restore();

            var rawPixelData = ccCtx.getImageData(0, 0, x + elemImg.width, y + elemImg.height).data;

            for (var i = 0; i < rawPixelData.length; i += 4) {
                var alphaValue = rawPixelData[i + 3];
                if (alphaValue != 0) {
                    return true;
                }
            }
            return false;
        }

        var time = 0;
        var duration = 60;
        var lastOffSetY;

        function shakeTheScreen() {
            if (shaking) {
                if (smallShaking) {
                    var offSet = elasticOutShake(time, duration, 25, 5);
                    shaker.forEach(function (item) {
                        if (time == 0) {
                            item._startValueX = item.x;
                        }
                        if (offSet != 0) {
                            item.x = item._startValueX + offSet;
                        } else {
                            item.x = item._startValueX;
                        }
                    });

                } else if (bigShaking) {
                    var amplitude = 150;
                    var period = 5;
                    var offSetX = elasticOutShake(time, duration, amplitude - 50, period + 5);
                    var offSetY = elasticOutShake(time, duration, amplitude, period);

                    shaker.forEach(function (item) {
                        if (time == 0) {
                            item._startValueX = item.x;
//                            item._startValueY = item.y;
                            lastOffSetY = 0;
                        }
                        if (offSetX != 0) {
                            item.x = item._startValueX + offSetX;
                        } else {
                            item.x = item._startValueX;
                        }
                        if (offSetY != 0) {
                            item.y = (item.y - lastOffSetY) + offSetY;
                        } else {
                            item.y = (item.y - lastOffSetY);
                        }
                    });
                    lastOffSetY = offSetY;
                }

                time++;
                if (time >= duration) {
                    time = 0;
                    shaking = false;

                    shaker.forEach(function (item) {
                        item.x = item._startValueX;
                        delete item._startValueX;

                        if (bigShaking) {
                            item.y = item.y - lastOffSetY;
                            lastOffSetY = 0;
                        }
                    });

                    smallShaking = false;
                    bigShaking = false;
                }
            }
        }

        function smallScreenShake() {
            if (shaking) {
                if (bigShaking) {
                    return;
                }
                shaker.forEach(function (item) {
                    item.x = item._startValueX;
                });
            }

            shaking = true;
            time = 0;
            smallShaking = true;
        }

        function bigScreenShake() {
            if (shaking) {
                if (smallShaking) {
                    smallShaking = false;
                }

                shaker.forEach(function (item) {
                    item.x = item._startValueX;
                });

                if (bigShaking) {
                    shaker.forEach(function (item) {
                        item.y = item.y - lastOffSetY;
                    });
                    lastOffSetY = 0;
                }
            }

            shaking = true;
            time = 0;
            bigShaking = true;
        }

        function elasticOutShake(currentTime, duration, amplitude, period) {
            if (currentTime == 0 || (currentTime /= duration) == 1) {
                return 0;
            }

            return Math.floor(amplitude * Math.pow(2, -10 * currentTime) * Math.sin((currentTime * duration) * (2 * Math.PI) / period));
        }

        this.gameLoop.add('shake', shakeTheScreen);
        this.gameLoop.add('collisions', collisions);
        this.gameLoop.add('level', generateLevel);

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;


        var energyDrainSprite;
        var energyLoadSprite;

        function initEnergyRenderStuff() {
            energyDrainSprite = stage.getSprite('energy-drain-anim/energy_drain', 90, false);
            energyLoadSprite = stage.getSprite('energy-load-anim/energy_load', 90, false);
        }

        function drainEnergy() {
            function turnShieldsOn() {
                shieldsOn = true;
                stage.animate(shieldsDrawable, shieldsUpSprite, function () {
                    shieldsDrawable.img = stage.getSubImage("shield3");
                });
            }

            function startDraining() {
                var position = 0;
                if (stage.animations.has(energyBarDrawable)) {
                    position = 89 - stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time;
                }

                stage.animate(energyBarDrawable, energyDrainSprite, energyEmpty);

                stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time = position;
                energyBarDrawable.img = stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
            }

            turnShieldsOn();
            startDraining();
        }

        function energyEmpty() {
            function setEnergyBarEmpty() {
                energyBarDrawable.img = stage.getSubImage('energy_bar_empty');
            }

            turnShieldsOff();
            setEnergyBarEmpty();
        }

        function turnShieldsOff() {
            shieldsOn = false;
            stage.animate(shieldsDrawable, shieldsDownSprite, function () {
                stage.remove(shieldsDrawable);
            });
        }

        function loadEnergy() {
            function startLoading() {
                var position = 0;
                if (stage.animations.has(energyBarDrawable)) {
                    position = 89 - stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time;
                }
                stage.animate(energyBarDrawable, energyLoadSprite, energyFull);

                stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time = position;
                energyBarDrawable.img = stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
            }

            if (shieldsOn) {
                turnShieldsOff();
            }
            startLoading();
        }

        function energyFull() {
            function setEnergyBarFull() {
                energyBarDrawable.img = stage.getSubImage('energy_bar_full');
            }

            setEnergyBarFull();
        }

        initEnergyRenderStuff();

        var touchable = {id: 'shields_up', x: 0, y: 0, width: 320, height: 480};
        this.gameController.add(touchable, drainEnergy, loadEnergy);

        //end scene todo move to own scene
        function endGame() {
            for (var key in lifeDrawables) {
                if (lifeDrawables.hasOwnProperty(key)) {
                    stage.remove(lifeDrawables[key]);
                }
            }

            self.gameLoop.remove('shake');
            self.gameLoop.remove('collisions');
            self.gameLoop.remove('level');

            self.gameController.remove(touchable);

            var barOut = stage.getPath(energyBarDrawable.x, energyBarDrawable.y, energyBarDrawable.x, energyBarDrawable.y + 100, 60, Transition.EASE_OUT_EXPO);
            stage.move(energyBarDrawable, barOut, function () {
                stage.remove(energyBarDrawable);
            });

//            if (DEBUG_START_IMMEDIATELY) {
//                stage.remove(shipDrawable);
//                stage.remove(fireDrawable);
//                speedStripes.forEach(function (speedStripe) {
//                    stage.remove(speedStripe);
//                });
//                countDrawables.forEach(function (count) {
//                    stage.remove(count);
//                });
//                self._postGameScene(stage, points);
//            } else {
            self._endGameScene(stage, shipDrawable, fireDrawable, speedStripes, points, countDrawables);
//            }
        }
    };

    App.prototype._endGameScene = function (stage, shipDrawable, fireDrawable, speedStripes, points, countDrawables) {

        speedStripes.forEach(function (speedStripe) {
            stage.remove(speedStripe);
        });

        var dockShipToMiddlePosition = stage.getPath(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, 480 / 2, 120, Transition.EASE_OUT_EXPO);

        var explosionSprite = stage.getSprite('explosion-anim/explosion', 25, false);

        var self = this;
        stage.move(shipDrawable, dockShipToMiddlePosition, function () {
            stage.animate(shipDrawable, explosionSprite, function () {
                stage.remove(shipDrawable);
                stage.remove(fireDrawable);

                countDrawables.forEach(function (count) {
                    stage.remove(count);
                });
                self._postGameScene(stage, points);
            });
        });
        stage.move(fireDrawable, dockShipToMiddlePosition);
    };

    App.prototype._postGameScene = function (stage, points) {

        var self = this;
        var gameOverX = 320 / 2;
        var gameOverY = 480 / 4 - 25;
        var gameOverStartY = gameOverY - 480;

        var gameOverDrawable = stage.moveFresh(gameOverX, gameOverStartY, 'gameover', gameOverX, gameOverY, 60,
            Transition.EASE_OUT_ELASTIC, false, function () {


                var scoreX = 320 / 2;
                var scoreY = 480 / 3;
                var scoreStartY = scoreY - 480;

                var scoreDrawable = stage.moveFresh(scoreX, scoreStartY, 'score', scoreX, scoreY, 60, Transition.EASE_OUT_BOUNCE);

                var digitLabelOffset = 35;
                var newScoreY = scoreY + digitLabelOffset;
                var newScoreStartY = newScoreY - 480;
                var digitOffset = 20;

                var commonKeyPartForNumbers = 'num/numeral',
                    i, x;

                var pointsInString = points.toString();
                var scoreFirstDigitX = 320 / 2 - ((pointsInString.length - 1) * 10); //320 / 3;

                var newScoreDigits = [];
                for (i = 0; i < pointsInString.length; i++) {
                    x = scoreFirstDigitX + i * digitOffset;
                    var scoreDigitDrawable = stage.moveFreshLater(x, newScoreStartY,
                            commonKeyPartForNumbers + pointsInString[i], x, newScoreY, 60, Transition.EASE_OUT_BOUNCE, 5);
                    newScoreDigits.push(scoreDigitDrawable);
                }

                var bestX = 320 / 2;
                var bestY = 480 / 2;
                var bestStartY = bestY - 480;

                var bestDrawable = stage.moveFreshLater(bestX, bestStartY, 'best', bestX, bestY, 60, Transition.EASE_OUT_BOUNCE, 10);

                var allTimeHighScore = localStorage.getItem('allTimeHighScore');
                if (allTimeHighScore == null) {
                    allTimeHighScore = "0";
                }

                var highScoreY = bestY + digitLabelOffset;
                var highScoreStartY = highScoreY - 480;

                var highScoreFirstDigitX = 320 / 2 - ((allTimeHighScore.length - 1) * 10);

                var highScoreDigits = [];
                for (i = 0; i < allTimeHighScore.length; i++) {
                    x = highScoreFirstDigitX + i * digitOffset;
                    var highScoreDigitDrawable = stage.moveFreshLater(x, highScoreStartY,
                            commonKeyPartForNumbers + allTimeHighScore[i], x, highScoreY, 60, Transition.EASE_OUT_BOUNCE, 15);
                    highScoreDigits.push(highScoreDigitDrawable);
                }

                var playX = 320 / 2;
                var playY = 480 / 4 * 3;
                var playStartY = playY - 480;
                var pressPlaySprite = stage.getSprite('press-play-anim/press_play', 16, false);
                var playDrawable = stage.moveFreshLater(playX, playStartY, 'play', playX, playY, 60, Transition.EASE_OUT_BOUNCE, 20, false, function () {

                    var touchable = {id: 'play_again_tap', x: 0, y: 0, width: 320, height: 480};
                    self.tapController.add(touchable, function () {
                        // end event
                        self.tapController.remove(touchable);

                        stage.animate(playDrawable, pressPlaySprite, function () {
                            playDrawable.img = stage.getSubImage('play');

                            var playPathOut = stage.getPath(playDrawable.x, playDrawable.y, playDrawable.x, playDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                            stage.move(playDrawable, playPathOut, function () {
                                stage.remove(playDrawable);
                            });
                            var highScorePathOut = stage.getPath(highScoreDigits[0].x, highScoreDigits[0].y, highScoreDigits[0].x, highScoreDigits[0].y + 480, 30, Transition.EASE_IN_EXPO);
                            highScoreDigits.forEach(function (elem, index) {
                                stage.moveLater({item: elem, path: highScorePathOut, ready: function () {
                                    stage.remove(elem);
                                }}, 5 + index);
                            });
                            var bestPathOut = stage.getPath(bestDrawable.x, bestDrawable.y, bestDrawable.x, bestDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                            stage.moveLater({item: bestDrawable, path: bestPathOut, ready: function () {
                                stage.remove(bestDrawable);
                            }}, 10);
                            var newScorePathOut = stage.getPath(0, newScoreDigits[0].y, 0, newScoreDigits[0].y + 480, 30, Transition.EASE_IN_EXPO);
                            newScoreDigits.forEach(function (elem, index) {
                                stage.moveLater({item: elem, path: newScorePathOut, ready: function () {
                                    stage.remove(elem);
                                }}, 15 + index);
                            });
                            var scorePathOut = stage.getPath(scoreDrawable.x, scoreDrawable.y, scoreDrawable.x, scoreDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                            stage.moveLater({item: scoreDrawable, path: scorePathOut, ready: function () {
                                stage.remove(scoreDrawable);
                            }}, 20);
                            var gameOverPathOut = stage.getPath(gameOverDrawable.x, gameOverDrawable.y, gameOverDrawable.x, gameOverDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                            stage.moveLater({item: gameOverDrawable, path: gameOverPathOut, ready: function () {
                                stage.remove(gameOverDrawable);

//                                if (DEBUG_START_IMMEDIATELY) {
//                                    self._preGameScene(stage, atlasMapper, null, null);
//                                } else {
                                self._preGameScene(stage, stage.animateFresh(320 / 2, 480 / 6, 'logo-anim/logo', 44),
                                    self._showSpeedStripes(stage, 0));
//                                }
                            }}, 25, function () {
                                if (points > parseInt(allTimeHighScore, 10)) {
                                    localStorage.setItem('allTimeHighScore', points);
                                }
                            });
                        });
                    });
                });
            });
    };

    function range(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return App;

})({
    ResourceLoader: ResourceLoader,
    SimpleLoadingScreen: SimpleLoadingScreen,
    Renderer: Renderer,
    GameLoop: GameLoop,
    AtlasMapper: AtlasMapper,
    Transition: Transition,
    AnimationStudio: AnimationStudio,
    AnimationDirector: AnimationDirector,
    MotionStudio: MotionStudio,
    MotionDirector: MotionDirector,
    StageDirector: StageDirector,
    localStorage: localStorage
});