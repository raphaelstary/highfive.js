var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio, AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager) {

    function App(screen, screenCtx, requestAnimationFrame, resizeBus, screenInput) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
    }

    App.prototype.start = function (windowWidth, windowHeight) {
        // 1st screen: show loading screen, load binary resources

        var resourceLoader = new ResourceLoader(),
            atlas = resourceLoader.addImage('gfx/atlas.png'),
            atlasInfo = resourceLoader.addJSON('data/atlas.json'),
            initialScreen = new SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        resourceLoader.onComplete = this._showPreGame.bind(this, atlas, atlasInfo, windowWidth);

        resourceLoader.load();
    };

    App.prototype._drawStatic = function (atlasMapper, renderer, id, x, y) {
        var img = atlasMapper.get(id);
        var drawable = new Drawable(id, x, y, img);
        renderer.add(drawable);
        return drawable;
    };

    App.prototype._drawAnimated = function(atlasMapper, animationStudio, renderer, numFrames, path, id, x, y) {
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

    App.prototype._drawSpeedOne = function (atlasMapper, startMotionsManager, renderer) {

        var speed = atlasMapper.get('speed');
        var speedDrawableOne = new Drawable('speedOne', 320 / 4, 0 - speed.height / 2, speed);
        var speedOnePath = new Path(speedDrawableOne.x, speedDrawableOne.y, speedDrawableOne.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);
        startMotionsManager.throttleAdd({item: speedDrawableOne, path: speedOnePath}, 0, function () {
            renderer.add(speedDrawableOne);
        });
    };

    App.prototype._drawMoved = function (atlasMapper, startMotionsManager, renderer, imgId, id, x, y, endX, endY, delay) {
        var subImage = atlasMapper.get(imgId);
        var drawable = new Drawable(id, x, y, subImage);
        var path = new Path(x, y, endX, endY,
                Math.abs(x-endX) + Math.abs(y - endY), 30, Transition.LINEAR, true);
        startMotionsManager.throttleAdd({item: drawable, path: path}, delay, function () {
            renderer.add(drawable);
        });
    };

    App.prototype._showPreGame = function (atlas, atlasInfo, windowWidth) {

        this.resizeBus.remove('initial_screen');

        var atlasMapper = new AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);
        this.resizeBus.add('mapper', atlasMapper.resize.bind(atlasMapper));

        var renderer = new Renderer(this.screen, this.screenCtx, atlas);
        this.resizeBus.add('renderer', renderer.resize.bind(renderer));

        var startMotions = new MotionStudio(),
            startMotionsManager = new MotionStudioManager(startMotions);

        var animationStudio = new AnimationStudio(),
            animationStudioManager = new AnimationStudioManager(animationStudio);

        this._drawStatic(atlasMapper, renderer, 'background', 320 / 2, 480 / 2);

        this._drawSpeedOne(atlasMapper, startMotionsManager, renderer);

        var speed = atlasMapper.get('speed');
        var speedDrawableTwo = new Drawable('speedTwo', 320 / 3 * 2, 0 - speed.height / 2, speed);
        var speedTwoPath = new Path(speedDrawableTwo.x, speedDrawableTwo.y, speedDrawableTwo.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);

        startMotionsManager.throttleAdd({item: speedDrawableTwo, path: speedTwoPath}, 34, function () {
            renderer.add(speedDrawableTwo);
        });

        var speedDrawableThree = new Drawable('speedThree', 320 / 8 * 7, 0 - speed.height / 2, speed);
        var speedThreePath = new Path(speedDrawableThree.x, speedDrawableThree.y, speedDrawableThree.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);

        startMotionsManager.throttleAdd({item: speedDrawableThree, path: speedThreePath}, 8, function () {
            renderer.add(speedDrawableThree);
        });

        var speedDrawableFour = new Drawable('speedFour', 320 / 16 * 7, 0 - speed.height / 2, speed);
        var speedFourPath = new Path(speedDrawableFour.x, speedDrawableFour.y, speedDrawableFour.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);

        startMotionsManager.throttleAdd({item: speedDrawableFour, path: speedFourPath}, 24, function () {
            renderer.add(speedDrawableFour);
        });

        var speedDrawableFive = new Drawable('speedFive', 320 / 16, 0 - speed.height / 2, speed);
        var speedFivePath = new Path(speedDrawableFive.x, speedDrawableFive.y, speedDrawableFive.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);

        startMotionsManager.throttleAdd({item: speedDrawableFive, path: speedFivePath}, 16, function () {
            renderer.add(speedDrawableFive);
        });


        var shipDrawable = this._drawStatic(atlasMapper, renderer, 'ship', 320 / 2, 480 / 8 * 5);

        var fireDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 7, 'fire-anim/fire', 'fire', 320 / 2, 480 / 8 * 5);
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
        var doTheShields = true;
        function shieldsAnimation() {
            var shieldsDownSprite = new Sprite(shieldsDownFrames, false);
            var shieldsUpSprite = new Sprite(shieldsUpFrames, false);
            var shieldsDrawable = new Drawable('shields', 320 / 2, 480 / 8 * 5);

            animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = shieldStatic;
                animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    renderer.remove(shieldsDrawable);
                    startTimer = 20;
                    if (doTheShields) {
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


        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var logoDrawable = this._drawAnimated(atlasMapper, animationStudio, renderer, 43, 'logo-anim/logo', 'logo', 320 / 2, 480 / 6);


        this.tapController.add({x: 0, y: 0, width: 320, height: 480}, function () {
            var getReadyOutPath = new Path(getReadyDrawable.x, getReadyDrawable.y,
                    getReadyDrawable.x + getReadyDrawable.img.width, getReadyDrawable.y, getReadyDrawable.img.width, 60,
                Transition.EASE_IN_OUT_EXPO);

            startMotions.move(getReadyDrawable, getReadyOutPath, function () {
                animationStudio.remove(getReadyDrawable);
                renderer.remove(getReadyDrawable);

                var ready3Drawable = new Drawable('ready3', -ready3.width, 480 / 3, ready3);
                var ready3Path = new Path(-ready3.width, 480 / 3, 320 + ready3.width, 480 / 3,
                        320 + 2 * ready3.width, 90, Transition.EASE_IN_OUT_QUAD);

                startMotions.move(ready3Drawable, ready3Path, function () {
                    renderer.remove(ready3Drawable);

                    var ready2Drawable = new Drawable('ready2', -ready2.width, 480 / 3, ready2);
                    var ready2Path = new Path(-ready2.width, 480 / 3, 320 + ready2.width, 480 / 3,
                            320 + 2 * ready2.width, 90, Transition.EASE_IN_OUT_QUAD);

                    startMotions.move(ready2Drawable, ready2Path, function () {
                        renderer.remove(ready2Drawable);

                        doTheShields = false;

                        var ready1Drawable = new Drawable('ready1', -ready1.width, 480 / 3, ready1);
                        var ready1Path = new Path(-ready1.width, 480 / 3, 320 + ready1.width, 480 / 3,
                                320 + 2 * ready1.width, 90, Transition.EASE_IN_OUT_QUAD);

                        startMotions.move(ready1Drawable, ready1Path, function () {
                            renderer.remove(ready1Drawable);

                            var logoOut = new Path(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                            startMotions.move(logoDrawable, logoOut, function () {
                                renderer.remove(logoDrawable);
                                animationStudio.remove(logoDrawable);
                            });

                            var tapOut = new Path(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 480, 30, Transition.EASE_IN_EXPO);
                            startMotions.move(tapDrawable, tapOut, function () {
                                renderer.remove(tapDrawable);
                                animationStudio.remove(tapDrawable);
                            });

                            var dockShipToGamePosition = new Path(shipDrawable.x, shipDrawable.y,
                                shipDrawable.x, 400, 400 - shipDrawable.y, 30, Transition.EASE_IN_OUT_EXPO);

                            startMotions.move(shipDrawable, dockShipToGamePosition);
                            startMotions.move(fireDrawable, dockShipToGamePosition);

                        });
                        renderer.add(ready1Drawable);
                    });
                    renderer.add(ready2Drawable);

                });
                renderer.add(ready3Drawable);
            })
        });

        var gameLoop = new GameLoop(this.requestAnimationFrame, renderer, startMotions, startMotionsManager,
            animationStudio, animationStudioManager);
        gameLoop.run();

    };

    return App;
})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio,
    AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager);