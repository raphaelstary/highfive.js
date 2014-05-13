var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio, AnimationDirector, Path, Drawable, MotionStudio, MotionDirector) {
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

        resourceLoader.onComplete = this._preGameScene.bind(this, atlas, atlasInfo, windowWidth);

        resourceLoader.load();
    };

    App.prototype._drawStatic = function (atlasMapper, renderer, id, x, y) {
        var img = atlasMapper.get(id);
        var drawable = new Drawable(id, x, y, img);
        renderer.add(drawable);
        return drawable;
    };

    App.prototype._drawAnimated = function (atlasMapper, animations, renderer, numFrames, path, id, x, y) {
        var frames = [];
        var i;
        for (i = 0; i <= numFrames; i++) {
            if (i < 10) {
                frames.push(atlasMapper.get(path + '_000' + i));
            } else {
                frames.push(atlasMapper.get(path + '_00' + i));
            }
        }
        var sprite = new Sprite(frames);
        var drawable = new Drawable(id, x, y);
        animations.animate(drawable, sprite);
        renderer.add(drawable);
        return drawable;
    };

    App.prototype._drawSpeed = function (atlasMapper, motions, renderer, id, x, delay) {
        this._drawMoved(atlasMapper, motions, renderer, 'speed', id, x, -108 / 2, x, 480 + 108 / 2, 30, true, delay);
    };

    App.prototype._drawMoved = function (atlasMapper, motions, renderer, imgId, id, x, y, endX, endY, speed, loop, delay) {
        var subImage = atlasMapper.get(imgId);
        var drawable = new Drawable(id, x, y, subImage);
        var path = new Path(x, y, endX, endY, Math.abs(x - endX) + Math.abs(y - endY), speed, Transition.LINEAR, loop);

        var finishMovement = loop ? undefined : function () {
            renderer.remove(drawable);
        };

        if (delay === 0) {
            motions.move(drawable, path, finishMovement);
            renderer.add(drawable);
        } else {
            var movedItem = {item: drawable, path: path, ready: finishMovement};
            motions.moveLater(movedItem, delay, function () {
                renderer.add(drawable);
            });
        }

        return drawable;
    };

    App.prototype._preGameScene = function (atlas, atlasInfo, windowWidth) {

        this.resizeBus.remove('initial_screen');

        var atlasMapper = new AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);
        this.resizeBus.add('mapper', atlasMapper.resize.bind(atlasMapper));

        var renderer = new Renderer(this.screen, this.screenCtx, atlas);
        this.resizeBus.add('renderer', renderer.resize.bind(renderer));

        var motions = new MotionDirector(new MotionStudio());

        var animations = new AnimationDirector(new AnimationStudio());

        this._drawStatic(atlasMapper, renderer, 'background', 320 / 2, 480 / 2);

        this._drawSpeed(atlasMapper, motions, renderer, 'speedOne', 320 / 4, 0);
        this._drawSpeed(atlasMapper, motions, renderer, 'speedTwo', 320 / 3 * 2, 34);
        this._drawSpeed(atlasMapper, motions, renderer, 'speedThree', 320 / 8 * 7, 8);
        this._drawSpeed(atlasMapper, motions, renderer, 'speedFour', 320 / 16 * 7, 24);
        this._drawSpeed(atlasMapper, motions, renderer, 'speedFive', 320 / 16, 16);

        var shipDrawable = this._drawStatic(atlasMapper, renderer, 'ship', 320 / 2, 480 / 8 * 5);

        var fireDrawable = this._drawAnimated(atlasMapper, animations, renderer, 7, 'fire-anim/fire', 'fire', 320 / 2, 480 / 8 * 5);

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
        var shieldsDrawable = new Drawable('shields', 320 / 2, 480 / 8 * 5);

        //------------------------------- DEBUG_ONLY start
        if (DEBUG_START_IMMEDIATELY) {
            this._startGameLoop(renderer, motions, animations);
            this._startingPositionScene(atlasMapper, motions, animations, renderer, shipDrawable, fireDrawable,
                shieldsDrawable, shieldsUpSprite, shieldsDownSprite, shieldStatic);

            return;
        }
        //------------------------------- DEBUG_ONLY end

        var startTimer = 10;
        this.doTheShields = true;
        var self = this;
        function shieldsAnimation() {

//            var shieldsDownSprite = new Sprite(shieldsDownFrames, false);
//            var shieldsUpSprite = new Sprite(shieldsUpFrames, false);
//            var shieldsDrawable = new Drawable('shields', 320 / 2, 480 / 8 * 5);

            animations.animateLater({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = shieldStatic;
                animations.animateLater({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    renderer.remove(shieldsDrawable);
                    startTimer = 20;
                    if (self.doTheShields) {
                        shieldsAnimation();
                    }
                }}, 28)
            }}, startTimer, function () {
                renderer.add(shieldsDrawable);
            });
        }

        shieldsAnimation();

        var tapDrawable = this._drawAnimated(atlasMapper, animations, renderer, 35, 'tap-anim/tap', 'tap', 320 / 16 * 9, 480 / 8 * 7);

        var getReadyDrawable = this._drawAnimated(atlasMapper, animations, renderer, 41, 'ready-anim/get_ready', 'get_ready', 320 / 2, 480 / 3);

        var logoDrawable = this._drawAnimated(atlasMapper, animations, renderer, 43, 'logo-anim/logo', 'logo', 320 / 2, 480 / 6);

        // end of screen


        var touchable = {id: 'ready_tap', x: 0, y: 0, width: 320, height: 480};
        this.tapController.add(touchable, function() {
            // end event
            self.tapController.remove(touchable);

            // next scene
            self._getReadyScene(atlasMapper, motions, animations, renderer,
                tapDrawable, getReadyDrawable, logoDrawable, shipDrawable, fireDrawable, shieldsDrawable,
                shieldsUpSprite, shieldsDownSprite, shieldStatic);
        });

        this._startGameLoop(renderer, motions, animations);
    };

    App.prototype._startGameLoop = function(renderer, motions, animations) {
        this.gameLoop = new GameLoop(this.requestAnimationFrame);

        this.gameLoop.add('drawAnimations', function() {
            renderer.draw();
            motions.update();
            animations.update();
        });

        this.gameLoop.run();
    };

    App.prototype._getReadyScene = function (atlasMapper, motions, animations, renderer,
                                             tapDrawable, getReadyDrawable, logoDrawable, shipDrawable,
                                             fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                                             shieldStatic) {

        var getReadyOutPath = new Path(getReadyDrawable.x, getReadyDrawable.y,
                getReadyDrawable.x + getReadyDrawable.img.width, getReadyDrawable.y, getReadyDrawable.img.width, 60,
            Transition.EASE_IN_OUT_EXPO);

        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var self = this;
        motions.move(getReadyDrawable, getReadyOutPath, function () {
            animations.remove(getReadyDrawable);
            renderer.remove(getReadyDrawable);

            var ready3Drawable = new Drawable('ready3', -ready3.width, 480 / 3, ready3);
            var ready3Path = new Path(-ready3.width, 480 / 3, 320 + ready3.width, 480 / 3,
                    320 + 2 * ready3.width, 90, Transition.EASE_IN_OUT_QUAD);

            motions.move(ready3Drawable, ready3Path, function () {
                renderer.remove(ready3Drawable);

                var ready2Drawable = new Drawable('ready2', -ready2.width, 480 / 3, ready2);
                var ready2Path = new Path(-ready2.width, 480 / 3, 320 + ready2.width, 480 / 3,
                        320 + 2 * ready2.width, 90, Transition.EASE_IN_OUT_QUAD);

                motions.move(ready2Drawable, ready2Path, function () {
                    renderer.remove(ready2Drawable);

                    self.doTheShields = false;

                    var ready1Drawable = new Drawable('ready1', -ready1.width, 480 / 3, ready1);
                    var ready1Path = new Path(-ready1.width, 480 / 3, 320 + ready1.width, 480 / 3,
                            320 + 2 * ready1.width, 90, Transition.EASE_IN_OUT_QUAD);

                    motions.move(ready1Drawable, ready1Path, function () {
                        // create end event method to end scene, this is endGetReadyScene
                        renderer.remove(ready1Drawable);

                        var logoOut = new Path(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        motions.move(logoDrawable, logoOut, function () {
                            renderer.remove(logoDrawable);
                            animations.remove(logoDrawable);
                        });

                        var tapOut = new Path(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        motions.move(tapDrawable, tapOut, function () {
                            renderer.remove(tapDrawable);
                            animations.remove(tapDrawable);
                        });

                        self._startingPositionScene(atlasMapper, motions, animations, renderer,
                            shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                            shieldStatic);
                    });
                    renderer.add(ready1Drawable);
                });
                renderer.add(ready2Drawable);
            });
            renderer.add(ready3Drawable);
        });
    };

    App.prototype._startingPositionScene = function(atlasMapper, motions, animations, renderer,
                                                    shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite,
                                                    shieldsDownSprite,
                                                    shieldStatic) {

        var dockShipToGamePosition = new Path(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, 400, 400 - shipDrawable.y, 30, Transition.EASE_IN_OUT_EXPO);

        motions.move(shipDrawable, dockShipToGamePosition, this._playGameScene.bind(this, atlasMapper,
            motions, animations, renderer, shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
            shieldStatic));

        motions.move(fireDrawable, dockShipToGamePosition);
    };


    App.prototype._drawAsteroid = function (atlasMapper, motions, renderer, file, id, x, speed) {
        return this._drawMoved(atlasMapper, motions, renderer, file, id, x, -108 / 2, x, 480 + 108 / 2, speed, false, 0);
    };

    App.prototype._playGameScene = function(atlasMapper, motions, animations, renderer,
                                            shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                                            shieldStatic) {
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

        var asteroidId = 0;
        var starId = 0;
        function nextAsteroidId() {
            ++asteroidId;
            if (asteroidId > 10) {
                asteroidId = 1;
            }
            return asteroidId;
        }
        function nextStarId() {
            ++starId;
            if (starId > 10) {
                starId = 1;
            }
            return starId;
        }

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
                drawable = self._drawAsteroid(atlasMapper, motions, renderer, 'asteroid' + self._range(1, 4),
                        'asteroid' + nextAsteroidId(), self._range(320/5, 4*320/5), asteroidSpeed);
                nextCount = pauseAfterAsteroid + self._range(0, maxTimeToNextAfterAsteroid);

                trackedAsteroids[drawable.id] = drawable;
            } else {
                drawable = self._drawAsteroid(atlasMapper, motions, renderer, 'star_gold',
                        'star' + nextStarId(), self._range(320/3, 2*320/3), starSpeed);
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
                    motions.remove(asteroid);
                    renderer.remove(asteroid);
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
                    motions.remove(star);
                    renderer.remove(star);
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

            ccCtx.drawImage(renderer.atlas, shipImg.x, shipImg.y, shipImg.width, shipImg.height, 0, 0, shipImg.width, shipImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - shipDrawable.getCornerX();
            var y = element.getCornerY() - shipDrawable.getCornerY();
            ccCtx.drawImage(renderer.atlas, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width, elemImg.height);

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
            renderer.add(shieldsDrawable);
            animations.animate(shieldsDrawable, shieldsUpSprite, function () {
                shieldsDrawable.img = shieldStatic;
            });
        }, function () {
            animations.animate(shieldsDrawable, shieldsDownSprite, function () {
                renderer.remove(shieldsDrawable);
            })
        });

        // TODO endscene event
        if (false) {
            this.gameLoop.remove('collisions');
            this.gameLoop.remove('level');
            renderer.remove(shipDrawable);
            renderer.remove(fireDrawable);
            this.tapController.remove(touchable);
        }
    };

    App.prototype._range = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return App;

})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio,
    AnimationDirector, Path, Drawable, MotionStudio, MotionDirector);