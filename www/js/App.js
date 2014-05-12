var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio, AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager) {
    var DEBUG_START_IMMEDIATELY = true;

    function App(screen, screenCtx, requestAnimationFrame, resizeBus, screenInput) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
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

    App.prototype._drawAnimated = function (atlasMapper, animationStudio, renderer, numFrames, path, id, x, y) {
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
        animationStudio.animate(drawable, sprite);
        renderer.add(drawable);
        return drawable;
    };

    App.prototype._drawSpeed = function (atlasMapper, startMotionsManager, renderer, id, x, delay) {
        this._drawMoved(atlasMapper, startMotionsManager, renderer, 'speed', id, x, -108 / 2, x, 480 + 108 / 2, 30, true, delay);
    };

    App.prototype._drawMoved = function (atlasMapper, startMotionsManager, renderer, imgId, id, x, y, endX, endY, speed, loop, delay) {
        var subImage = atlasMapper.get(imgId);
        var drawable = new Drawable(id, x, y, subImage);
        var path = new Path(x, y, endX, endY, Math.abs(x - endX) + Math.abs(y - endY), speed, Transition.LINEAR, loop);
        if (delay === 0) {
            startMotionsManager.move(drawable, path);
            renderer.add(drawable);
        } else {
            startMotionsManager.moveLater({item: drawable, path: path}, delay, function () {
                renderer.add(drawable);
            });
        }
    };

    App.prototype._preGameScene = function (atlas, atlasInfo, windowWidth) {

        this.resizeBus.remove('initial_screen');

        var atlasMapper = new AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);
        this.resizeBus.add('mapper', atlasMapper.resize.bind(atlasMapper));

        var renderer = new Renderer(this.screen, this.screenCtx, atlas);
        this.resizeBus.add('renderer', renderer.resize.bind(renderer));

        var startMotionsManager = new MotionStudioManager(new MotionStudio());

        var animationStudio = new AnimationStudio(),
            animationStudioManager = new AnimationStudioManager(animationStudio);

        this._drawStatic(atlasMapper, renderer, 'background', 320 / 2, 480 / 2);

        this._drawSpeed(atlasMapper, startMotionsManager, renderer, 'speedOne', 320 / 4, 0);
        this._drawSpeed(atlasMapper, startMotionsManager, renderer, 'speedTwo', 320 / 3 * 2, 34);
        this._drawSpeed(atlasMapper, startMotionsManager, renderer, 'speedThree', 320 / 8 * 7, 8);
        this._drawSpeed(atlasMapper, startMotionsManager, renderer, 'speedFour', 320 / 16 * 7, 24);
        this._drawSpeed(atlasMapper, startMotionsManager, renderer, 'speedFive', 320 / 16, 16);

        var shipDrawable = this._drawStatic(atlasMapper, renderer, 'ship', 320 / 2, 480 / 8 * 5);

        var fireDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 7, 'fire-anim/fire', 'fire', 320 / 2, 480 / 8 * 5);

        if (DEBUG_START_IMMEDIATELY) {
            this._startGameLoop(renderer, startMotionsManager, animationStudioManager);
            this._startingPositionScene(atlasMapper, startMotionsManager, renderer, shipDrawable, fireDrawable);

            return;
        }

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

        var startTimer = 10;
        this.doTheShields = true;
        var self = this;
        function shieldsAnimation() {
            var shieldsDownSprite = new Sprite(shieldsDownFrames, false);
            var shieldsUpSprite = new Sprite(shieldsUpFrames, false);
            var shieldsDrawable = new Drawable('shields', 320 / 2, 480 / 8 * 5);

            animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = shieldStatic;
                animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
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

        var tapDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 35, 'tap-anim/tap', 'tap', 320 / 16 * 9, 480 / 8 * 7);

        var getReadyDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 41, 'ready-anim/get_ready', 'get_ready', 320 / 2, 480 / 3);

        var logoDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 43, 'logo-anim/logo', 'logo', 320 / 2, 480 / 6);

        // end of screen


        var touchable = {id: 'ready_tap', x: 0, y: 0, width: 320, height: 480};
        this.tapController.add(touchable, function() {
            // end event
            self.tapController.remove(touchable);

            // next scene
            self._getReadyScene(atlasMapper, startMotionsManager, renderer, animationStudio,
                tapDrawable, getReadyDrawable, logoDrawable, shipDrawable, fireDrawable);
        });

        this._startGameLoop(renderer, startMotionsManager, animationStudioManager);
    };

    App.prototype._startGameLoop = function(renderer, startMotionsManager, animationStudioManager) {
        this.gameLoop = new GameLoop(this.requestAnimationFrame);

        this.gameLoop.add('drawAnimations', function() {
            renderer.draw();
            startMotionsManager.update();
            animationStudioManager.update();
        });

        this.gameLoop.run();
    };

    App.prototype._getReadyScene = function (atlasMapper, startMotionsManager, renderer, animationStudio,
                                         tapDrawable, getReadyDrawable, logoDrawable, shipDrawable, fireDrawable) {
        var getReadyOutPath = new Path(getReadyDrawable.x, getReadyDrawable.y,
                getReadyDrawable.x + getReadyDrawable.img.width, getReadyDrawable.y, getReadyDrawable.img.width, 60,
            Transition.EASE_IN_OUT_EXPO);

        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var self = this;
        startMotionsManager.move(getReadyDrawable, getReadyOutPath, function () {
            animationStudio.remove(getReadyDrawable);
            renderer.remove(getReadyDrawable);

            var ready3Drawable = new Drawable('ready3', -ready3.width, 480 / 3, ready3);
            var ready3Path = new Path(-ready3.width, 480 / 3, 320 + ready3.width, 480 / 3,
                    320 + 2 * ready3.width, 90, Transition.EASE_IN_OUT_QUAD);

            startMotionsManager.move(ready3Drawable, ready3Path, function () {
                renderer.remove(ready3Drawable);

                var ready2Drawable = new Drawable('ready2', -ready2.width, 480 / 3, ready2);
                var ready2Path = new Path(-ready2.width, 480 / 3, 320 + ready2.width, 480 / 3,
                        320 + 2 * ready2.width, 90, Transition.EASE_IN_OUT_QUAD);

                startMotionsManager.move(ready2Drawable, ready2Path, function () {
                    renderer.remove(ready2Drawable);

                    self.doTheShields = false;

                    var ready1Drawable = new Drawable('ready1', -ready1.width, 480 / 3, ready1);
                    var ready1Path = new Path(-ready1.width, 480 / 3, 320 + ready1.width, 480 / 3,
                            320 + 2 * ready1.width, 90, Transition.EASE_IN_OUT_QUAD);

                    startMotionsManager.move(ready1Drawable, ready1Path, function () {
                        // create end event method to end scene, this is endGetReadyScene
                        renderer.remove(ready1Drawable);

                        var logoOut = new Path(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        startMotionsManager.move(logoDrawable, logoOut, function () {
                            renderer.remove(logoDrawable);
                            animationStudio.remove(logoDrawable);
                        });

                        var tapOut = new Path(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                        startMotionsManager.move(tapDrawable, tapOut, function () {
                            renderer.remove(tapDrawable);
                            animationStudio.remove(tapDrawable);
                        });

                        self._startingPositionScene(atlasMapper, startMotionsManager, renderer, shipDrawable, fireDrawable);
                    });
                    renderer.add(ready1Drawable);
                });
                renderer.add(ready2Drawable);
            });
            renderer.add(ready3Drawable);
        });
    };

    App.prototype._startingPositionScene = function(atlasMapper, startMotionsManager, renderer, shipDrawable, fireDrawable) {
        var dockShipToGamePosition = new Path(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, 400, 400 - shipDrawable.y, 30, Transition.EASE_IN_OUT_EXPO);

        startMotionsManager.move(shipDrawable, dockShipToGamePosition, this._playGameScene.bind(this, atlasMapper, startMotionsManager, renderer));
        startMotionsManager.move(fireDrawable, dockShipToGamePosition);
    };


    App.prototype._drawAsteroid = function (atlasMapper, startMotionsManager, renderer, file, id, x) {
        this._drawMoved(atlasMapper, startMotionsManager, renderer, file, id, x, -108 / 2, x, 480 + 108 / 2, 90, false, 0);
    };

    App.prototype._playGameScene = function(atlasMapper, startMotionsManager, renderer) {
        var self = this;

        var counter = 0;
        // im interval 0 - 100 kommt ein element
        var nextCount = this._range(0, 100);

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


        function generateLevel() {
            counter += 1;
            if (counter <= nextCount) {
                return;
            }

            counter = 0;

            // danach 30 mind pause
            nextCount = 30 + self._range(0, 100);

            // 2/3 asteroid, 1/3 star
            if (self._range(0, 8) < 6) {
                var asteroid1Drawable = self._drawAsteroid(atlasMapper, startMotionsManager, renderer, 'asteroid' + self._range(1, 4),
                        'asteroid' + nextAsteroidId(), self._range(320/5, 4*320/5));
            } else {
                var star1Drawable = self._drawAsteroid(atlasMapper, startMotionsManager, renderer, 'star_gold',
                        'star' + nextStarId(), self._range(320/3, 2*320/3));
            }

        }


        this.gameLoop.add('level', generateLevel);



        // TODO endscene event unregister('level');
    };

    App.prototype._range = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return App;

})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio,
    AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager);