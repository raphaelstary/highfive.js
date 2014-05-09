var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio, AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager) {

    function App(screen, screenCtx, requestAnimationFrame, resizeBus) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
    }

    App.prototype.start = function (windowWidth, windowHeight) {

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

        var background = atlasMapper.get('background');
        var backgroundDrawable = new Drawable('background', 320 / 2, 480 / 2, background);
        renderer.add(backgroundDrawable);

        var speed = atlasMapper.get('speed');

        var speedDrawableOne = new Drawable('speedOne', 320 / 4, 0 - speed.height / 2, speed);
        var speedOnePath = new Path(speedDrawableOne.x, speedDrawableOne.y, speedDrawableOne.x, 480 + speed.height / 2,
                480 + speed.height, 30, Transition.LINEAR, true);

        startMotions.move(speedDrawableOne, speedOnePath);
        renderer.add(speedDrawableOne);

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
        var speedFivePath = new Path (speedDrawableFive.x, speedDrawableFive.y, speedDrawableFive.x, 480 + speed.height / 2,
            480 + speed.height, 30, Transition.LINEAR, true);

        startMotionsManager.throttleAdd({item: speedDrawableFive, path: speedFivePath}, 16, function () {
            renderer.add(speedDrawableFive);
        });


        var ship = atlasMapper.get('ship');
        var shipDrawable = new Drawable('ship', 320 / 2, 480 / 8 * 5, ship);
        renderer.add(shipDrawable);

        var fireFrames = [];
        var i;
        for (i = 0; i <= 7; i++) {
            fireFrames.push(atlasMapper.get('fire-anim/fire_000' + i));
        }

        var fireSprite = new Sprite(fireFrames);
        var fireDrawable = new Drawable('fire', 320 / 2, 480 / 8 * 5);

        animationStudio.animate(fireDrawable, fireSprite);
        renderer.add(fireDrawable);

        var shieldStatic = atlasMapper.get("shield3");

        var shieldsUpFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsUpFrames.push(atlasMapper.get("shields-up-anim/shields_up_000" + i));
        }


        var shieldsDownFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsDownFrames.push(atlasMapper.get("shields-down-anim/shields_down_000" + i));
        }


        var startTimer = 10;

        function shieldsAnimation() {
            var shieldsDownSprite = new Sprite(shieldsDownFrames, false);
            var shieldsUpSprite = new Sprite(shieldsUpFrames, false);
            var shieldsDrawable = new Drawable('shields', 320 / 2, 480 / 8 * 5);

            animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = shieldStatic;
                animationStudioManager.throttleAnimate({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    renderer.remove(shieldsDrawable);
                    startTimer = 20;
                    shieldsAnimation();
                }}, 28)
            }}, startTimer, function () {
                renderer.add(shieldsDrawable);
            });
        }

        shieldsAnimation();

        var tapFrames = [];
        for (i = 0; i <= 35; i++) {
            if (i < 10) {
                tapFrames.push(atlasMapper.get("tap-anim/tap_000" + i));
            } else {
                tapFrames.push(atlasMapper.get("tap-anim/tap_00" + i));
            }
        }
        var tapSprite = new Sprite(tapFrames);
        var tapDrawable = new Drawable('tap', 320 / 16 * 9, 480 / 8 * 7);
        animationStudio.animate(tapDrawable, tapSprite);
        renderer.add(tapDrawable);

        var getReadyFrames = [];
        for (i = 0; i <= 41; i++) {
            if (i < 10) {
                getReadyFrames.push(atlasMapper.get("ready-anim/get_ready_000" + i));
            } else {
                getReadyFrames.push(atlasMapper.get("ready-anim/get_ready_00" + i));
            }
        }
        var getReadySprite = new Sprite(getReadyFrames);
        var getReadyDrawable = new Drawable('get_ready', 320 / 2, 480 / 3);
        animationStudio.animate(getReadyDrawable, getReadySprite);
        renderer.add(getReadyDrawable);

        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var logoFrames = [];
        for (i = 0; i <= 43; i++) {
            if (i < 10) {
                logoFrames.push(atlasMapper.get("logo-anim/logo_000" + i));
            } else {
                logoFrames.push(atlasMapper.get("logo-anim/logo_00" + i));
            }
        }
        var logoSprite = new Sprite(logoFrames);
        var logoDrawable = new Drawable('logo', 320 / 2, 480 / 6);
        animationStudio.animate(logoDrawable, logoSprite);
        renderer.add(logoDrawable);

        var gameLoop = new GameLoop(this.requestAnimationFrame, renderer, startMotions, startMotionsManager,
            animationStudio, animationStudioManager);
        gameLoop.run();

    };

    return App;
})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite, AnimationStudio,
    AnimationStudioManager, Path, Drawable, MotionStudio, MotionStudioManager);