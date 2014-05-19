var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite,
                     AnimationStudio, AnimationDirector, Path, Drawable, MotionStudio, MotionDirector, StageDirector) {
    var DEBUG_START_IMMEDIATELY = false;

    function App(screen, screenCtx, requestAnimationFrame, resizeBus, screenInput, gameController) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
        this.gameController = gameController;
    }

    App.prototype.start = function(windowWidth, windowHeight) {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene(windowWidth, windowHeight);
    };

    App.prototype._loadingScene = function(windowWidth, windowHeight) {
        // show loading screen, load binary resources

        var resourceLoader = new ResourceLoader(),
            atlas = resourceLoader.addImage('gfx/atlas.png'),
            atlasInfo = resourceLoader.addJSON('data/atlas.json'),
            initialScreen = new SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function () {
            self._initCommonSceneStuff(atlas, atlasInfo, windowWidth, self._introScene.bind(self));
            self.resizeBus.remove('initial_screen');
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (atlas, atlasInfo, windowWidth, firstScene) {
        var atlasMapper = new AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);

        var stage = new StageDirector(atlasMapper, new MotionDirector(new MotionStudio()),
            new AnimationDirector(new AnimationStudio()), new Renderer(this.screen, this.screenCtx, atlas));

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        firstScene(stage, atlasMapper);


    };

    App.prototype._introScene = function (stage, atlasMapper) {

        var firstBg = stage.drawFresh(320 / 2, 480 / 2, 'background', 0);
        var firstBgPath = new Path(320 / 2, 480 / 2, 320 / 2, 480 / 2 - 480, -480, 120, Transition.LINEAR);

        var bg = atlasMapper.get('background');
        var scrollingBackGround = new Drawable('background_scrolling', 320 / 2, 480 / 2 + 480, bg, 0);
        var scrollingBgPath = new Path(320 / 2, 480 / 2 + 480, 320 / 2, 480 / 2, -480, 120, Transition.LINEAR);

        var self = this;

        var speedY = 0; // 600
        var speedImg = atlasMapper.get('speed');

        var speedDrawableOne = new Drawable('speedOne', 320 / 4, speedY, speedImg, 1);
        var speedDrawableTwo = new Drawable('speedTwo', 320 / 8 * 7, speedY - 100, speedImg, 1);
        var speedDrawableThree = new Drawable('speedThree', 320 / 16, speedY - 200, speedImg, 1);
        var speedDrawableFour = new Drawable('speedFour', 320 / 16 * 7, speedY - 300, speedImg, 1);
        var speedDrawableFive = new Drawable('speedFive', 320 / 16, speedY - 400, speedImg, 1);
        var speedDrawableSix = new Drawable('speedSix', 320 / 3 * 2, speedY - 450, speedImg, 1);

        var x = 320 / 2,
            y = 480 + 20,
            yEnd = -20,
            length = -520;

        var letsplayIOLogo = atlasMapper.get('letsplayIO');
        var letsplayIO = new Drawable('letsplayIO', x, y + 50, letsplayIOLogo, 2);
        var letsplayIOPath = new Path(x, y + 50, x, yEnd - 50, length - 100, 120, Transition.EASE_OUT_IN_SIN);

        var presentsImg = atlasMapper.get('presents');
        var presentsDrawable = new Drawable('presents', x, y, presentsImg, 2);
        var presentsPath = new Path(x, y + 100, x, 30, length - 50, 120, Transition.EASE_OUT_IN_SIN);

        var logoYEnd = 480 / 6;
        var logoDrawable = stage.animateFresh(x, y, 'logo-anim/logo', 43);
        var logoInPath = new Path(x, y, x, logoYEnd, -420, 120, Transition.EASE_OUT_QUAD);

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

                stage.moveLater({item: logoDrawable, path: logoInPath, ready: function () {

                    self.gameLoop.remove('z_parallax');
                    self._preGameScene(stage, atlasMapper, logoDrawable);

                }}, 90, function () {
                    var delay = 30;
                    self._drawSpeed(stage, 320 / 4, 0 + delay);
                    self._drawSpeed(stage, 320 / 3 * 2, 34 + delay);
                    self._drawSpeed(stage, 320 / 8 * 7, 8 + delay);
                    self._drawSpeed(stage, 320 / 16 * 7, 24 + delay);
                    self._drawSpeed(stage, 320 / 16, 16 + delay);
                });
            }
        });

    };

    App.prototype._drawSpeed = function (stage, x, delay) {
        stage.moveFresh(x, -108 / 2, 'speed' , x, 480 + 108 / 2, 30, true, delay);
    };

    App.prototype._preGameScene = function (stage, atlasMapper, logoDrawable) {

        var shipStartY = 600;
        var shipEndY = 480 / 8 * 5;
        var shipDrawable = stage.drawFresh(320 / 2, shipStartY, 'ship');
        var shipInPath = new Path(320 / 2, shipStartY, 320 / 2, shipEndY, -(600 - shipEndY), 60, Transition.EASE_IN_QUAD);

        var fireDrawable = stage.animateFresh(320 / 2, shipStartY, 'fire-anim/fire', 7);
        var tapDrawable;
        var getReadyDrawable;
        stage.move(shipDrawable, shipInPath, function () {
            shipDrawable.y = shipEndY;
            shieldsAnimation();
            tapDrawable = stage.animateFresh(320 / 16 * 9, 480 / 8 * 7, 'tap-anim/tap', 35);
            getReadyDrawable = stage.animateFresh(320 / 2, 480 / 3, 'ready-anim/get_ready', 41);

        });
        stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        var shieldStatic = atlasMapper.get("shield3");

        var i;
        var shieldsUpFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsUpFrames.push(atlasMapper.get("shields-up-anim/shields_up_000" + i));
        }


        var shieldsDownFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsDownFrames.push(atlasMapper.get("shields-down-anim/shields_down_000" + i));
        }

        var shieldsDownSprite = new Sprite(shieldsDownFrames, false);
        var shieldsUpSprite = new Sprite(shieldsUpFrames, false);
        var shieldsDrawable = new Drawable('shields', 320 / 2, shipEndY);

        //------------------------------- DEBUG_ONLY start
        if (DEBUG_START_IMMEDIATELY) {
            this._startGameLoop(stage);
            this._startingPositionScene(atlasMapper, stage, shipDrawable, fireDrawable, shieldsDrawable,
                shieldsUpSprite, shieldsDownSprite, shieldStatic);

            return;
        }
        //------------------------------- DEBUG_ONLY end

        var startTimer = 10;
        this.doTheShields = true;
        var self = this;
        function shieldsAnimation() {

            stage.animateLater({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = shieldStatic;
                stage.animateLater({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    stage.remove(shieldsDrawable);
                    startTimer = 20;
                    if (self.doTheShields) {
                        shieldsAnimation();
                    }
                }}, 28)
            }}, startTimer);
        }

//        var tapDrawable = stage.animateFresh(320 / 16 * 9, 600, 'tap-anim/tap', 35);
//        var tapInPath = new Path(320 / 16 * 9, 600, 320 / 16 * 9, 480 / 8 * 7, -(600 - 480 / 8 * 7), 60, Transition.EASE_IN_QUAD);

//        stage.move(tapDrawable, tapInPath, function () {
//            tapDrawable.y = 480 / 8 * 7;
//        });

//        var getReadyDrawable = stage.animateFresh(320 / 2, 480 / 3, 'ready-anim/get_ready', 41);
//        var readyInPath = new Path(320 / 2, 600, 320 / 2, 480 / 3, -(600 - 480 / 3), 60, Transition.EASE_IN_QUAD);

//        stage.move(getReadyDrawable, readyInPath, function () {
//            getReadyDrawable.y = 480 / 3;
//        });

        // end of screen


        var touchable = {id: 'ready_tap', x: 0, y: 0, width: 320, height: 480};
        this.tapController.add(touchable, function() {
            // end event
            self.tapController.remove(touchable);

            // next scene
            self._getReadyScene(atlasMapper, stage, tapDrawable, getReadyDrawable, logoDrawable, shipDrawable,
                fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, shieldStatic);
        });
    };

    App.prototype._startGameLoop = function(stage) {
        this.gameLoop = new GameLoop(this.requestAnimationFrame);
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._getReadyScene = function (atlasMapper, stage, tapDrawable, getReadyDrawable, logoDrawable,
                                             shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite,
                                             shieldsDownSprite, shieldStatic) {

        var getReadyOutPath = new Path(getReadyDrawable.x, getReadyDrawable.y,
                getReadyDrawable.x + getReadyDrawable.img.width, getReadyDrawable.y, getReadyDrawable.img.width, 60,
            Transition.EASE_IN_OUT_EXPO);

        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var self = this;
        stage.move(getReadyDrawable, getReadyOutPath, function () {
            stage.remove(getReadyDrawable);

            var ready3Drawable = new Drawable('ready3', -ready3.width, 480 / 3, ready3);
            var ready3Path = new Path(-ready3.width, 480 / 3, 320 + ready3.width, 480 / 3,
                    320 + 2 * ready3.width, 90, Transition.EASE_IN_OUT_QUAD);

            stage.move(ready3Drawable, ready3Path, function () {
                stage.remove(ready3Drawable);

                var ready2Drawable = new Drawable('ready2', -ready2.width, 480 / 3, ready2);
                var ready2Path = new Path(-ready2.width, 480 / 3, 320 + ready2.width, 480 / 3,
                        320 + 2 * ready2.width, 90, Transition.EASE_IN_OUT_QUAD);

                stage.move(ready2Drawable, ready2Path, function () {
                    stage.remove(ready2Drawable);

                    self.doTheShields = false;

                    var ready1Drawable = new Drawable('ready1', -ready1.width, 480 / 3, ready1);
                    var ready1Path = new Path(-ready1.width, 480 / 3, 320 + ready1.width, 480 / 3,
                            320 + 2 * ready1.width, 90, Transition.EASE_IN_OUT_QUAD);

                    stage.move(ready1Drawable, ready1Path, function () {
                        // create end event method to end scene, this is endGetReadyScene
                        stage.remove(ready1Drawable);

                        var logoOut = new Path(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        stage.move(logoDrawable, logoOut, function () {
                            stage.remove(logoDrawable);
                        });

                        var tapOut = new Path(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        stage.move(tapDrawable, tapOut, function () {
                            stage.remove(tapDrawable);
                        });

                        self._startingPositionScene(atlasMapper, stage, shipDrawable, fireDrawable, shieldsDrawable,
                            shieldsUpSprite, shieldsDownSprite, shieldStatic);
                    });
                });
            });
        });
    };

    App.prototype._startingPositionScene = function(atlasMapper, stage, shipDrawable, fireDrawable, shieldsDrawable,
                                                    shieldsUpSprite, shieldsDownSprite, shieldStatic) {

        var dockShipToGamePosition = new Path(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, 400, 400 - shipDrawable.y, 30, Transition.EASE_IN_OUT_EXPO);

        stage.move(shipDrawable, dockShipToGamePosition, this._playGameScene.bind(this, atlasMapper,
            stage, shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
            shieldStatic));

        stage.move(fireDrawable, dockShipToGamePosition);
    };


    App.prototype._drawAsteroid = function (stage, imgName, x, speed) {
        return stage.moveFresh(x, -108 / 2, imgName, x, 480 + 108 / 2, speed, false, 0);
    };

    App.prototype._playGameScene = function(atlasMapper, stage, shipDrawable, shieldsDrawable, shieldsUpSprite,
                                            shieldsDownSprite, shieldStatic) {
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
        var nextCount = this._range(0, maxTimeToFirst);

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
            if (self._range(1, 100) <= percentageForAsteroid) {
                drawable = self._drawAsteroid(stage, 'asteroid' + self._range(1, 4), self._range(320/5, 4*320/5), asteroidSpeed);
                nextCount = pauseAfterAsteroid + self._range(0, maxTimeToNextAfterAsteroid);

                trackedAsteroids[drawable.id] = drawable;
            } else {
                drawable = self._drawAsteroid(stage, 'star_gold', self._range(320/3, 2*320/3), starSpeed);
                nextCount = pauseAfterStar + self._range(0, maxTimeToNextAfterStar);

                trackedStars[drawable.id] = drawable;
            }
        }

        function collisions() {
            var key;
            for (key in trackedAsteroids) {
                if (!trackedAsteroids.hasOwnProperty(key)) {
                    continue;
                }
                var asteroid = trackedAsteroids[key];

                if (needPreciseCollisionDetection(asteroid) && isHit(asteroid)) {
                    stage.remove(asteroid);
                    delete trackedAsteroids[key];

                    // TODO next scene explosions + call endscene event
                }
            }

            for (key in trackedStars) {
                if (!trackedStars.hasOwnProperty(key)) {
                    continue;
                }
                var star = trackedStars[key];

                if (needPreciseCollisionDetection(star) && isHit(star)) {
                    stage.remove(star);
                    delete trackedStars[key];

                    // TODO next scene explosions + call endscene event
                }
            }
        }

        function needPreciseCollisionDetection(element) {
            return shipDrawable.getCornerY() <= element.getEndY();
        }

        var collisionCanvas = document.createElement('canvas');
        var ccCtx = collisionCanvas.getContext('2d');
        collisionCanvas.width = shipDrawable.img.width;
        collisionCanvas.height = shipDrawable.img.height;

        function isHit(element) {
            ccCtx.clearRect(0, 0, shipDrawable.width, shipDrawable.height);

            var shipImg = shipDrawable.img;
            var elemImg = element.img;

            ccCtx.drawImage(stage.renderer.atlas, shipImg.x, shipImg.y, shipImg.width, shipImg.height, 0, 0, shipImg.width, shipImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - shipDrawable.getCornerX();
            var y = element.getCornerY() - shipDrawable.getCornerY();
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

        this.gameLoop.add('collisions', collisions);
        this.gameLoop.add('level', generateLevel);

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var touchable = {id: 'shields_up', x: 0, y: 0, width: 320, height: 480};
        this.gameController.add(touchable, function() {
            stage.animate(shieldsDrawable, shieldsUpSprite, function () {
                shieldsDrawable.img = shieldStatic;
            });
        }, function () {
            stage.animate(shieldsDrawable, shieldsDownSprite, function () {
                stage.remove(shieldsDrawable);
            })
        });

        // TODO endscene event
        if (false) {
            this.gameLoop.remove('collisions');
            this.gameLoop.remove('level');
            stage.remove(shipDrawable);
            stage.remove(fireDrawable);
            this.tapController.remove(touchable);
        }
    };

    App.prototype._range = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return App;

})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio,
    AnimationDirector, Path, Drawable, MotionStudio, MotionDirector, StageDirector);