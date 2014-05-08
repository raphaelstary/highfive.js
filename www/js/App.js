var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite) {

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

        var startScreen = new Scene(renderer),
            startScreenManager = new SceneManager(startScreen);

        var background = atlasMapper.get('background');
        var backgroundDrawable = {
            id: 'background',
            x: 320 / 2,
            y: 480 / 2,
            img: background
        };
        renderer.add(backgroundDrawable);

        var speed = atlasMapper.get('speed');

        var speedDrawableOne = {
            id: 'speedOne',
            x: 320 / 4,
            y: 0 - speed.height / 2,
            img: speed
        };
        var speedOnePath = {
            startX: speedDrawableOne.x,
            startY: speedDrawableOne.y,
            endX: speedDrawableOne.x,
            endY: 480 + speed.height / 2,
            length: 480 + speed.height,
            duration: 30, //frames
            timingFn: Transition.LINEAR
        };
        var usedOne = false;

        function addSpeedOne() {
            if (usedOne) {
                renderer.remove(speedDrawableOne);
            }
            speedDrawableOne = {
                id: 'speedOne',
                x: 320 / 4,
                y: 0 - speed.height / 2,
                img: speed
            };
            startScreen.add(speedDrawableOne, speedOnePath, addSpeedOne);
        }

        usedOne = true;
        addSpeedOne();

        var speedDrawableTwo = {
            id: 'speedTwo',
            x: 320 / 3 * 2,
            y: 0 - speed.height / 2,
            img: speed
        };
        var speedTwoPath = {
            startX: speedDrawableTwo.x,
            startY: speedDrawableTwo.y,
            endX: speedDrawableTwo.x,
            endY: 480 + speed.height / 2,
            length: 480 + speed.height,
            duration: 30, //frames
            timingFn: Transition.LINEAR
        };

        function addSpeedTwo() {
            renderer.remove(speedDrawableTwo);
            speedDrawableTwo = {
                id: 'speedTwo',
                x: 320 / 3 * 2,
                y: 0 - speed.height / 2,
                img: speed
            };
            startScreen.add(speedDrawableTwo, speedTwoPath, addSpeedTwo);
        }

        startScreenManager.throttleAdd({item: speedDrawableTwo, path: speedTwoPath, ready: addSpeedTwo}, 34);


        var speedDrawableThree = {
            id: 'speedThree',
            x: 320 / 8 * 7,
            y: 0 - speed.height / 2,
            img: speed
        };
        var speedThreePath = {
            startX: speedDrawableThree.x,
            startY: speedDrawableThree.y,
            endX: speedDrawableThree.x,
            endY: 480 + speed.height / 2,
            length: 480 + speed.height,
            duration: 30, //frames
            timingFn: Transition.LINEAR
        };

        function addSpeedThree() {
            renderer.remove(speedDrawableThree);
            speedDrawableThree = {
                id: 'speedThree',
                x: 320 / 8 * 7,
                y: 0 - speed.height / 2,
                img: speed
            };
            startScreen.add(speedDrawableThree, speedThreePath, addSpeedThree);
        }

        startScreenManager.throttleAdd({item: speedDrawableThree, path: speedThreePath, ready: addSpeedThree}, 8);

        var speedDrawableFour = {
            id: 'speedFour',
            x: 320 / 16 * 7,
            y: 0 - speed.height / 2,
            img: speed
        };
        var speedFourPath = {
            startX: speedDrawableFour.x,
            startY: speedDrawableFour.y,
            endX: speedDrawableFour.x,
            endY: 480 + speed.height / 2,
            length: 480 + speed.height,
            duration: 30, //frames
            timingFn: Transition.LINEAR
        };

        function addSpeedFour() {
            renderer.remove(speedDrawableFour);
            speedDrawableFour = {
                id: 'speedFour',
                x: 320 / 16 * 7,
                y: 0 - speed.height / 2,
                img: speed
            };
            startScreen.add(speedDrawableFour, speedFourPath, addSpeedFour);
        }

        startScreenManager.throttleAdd({item: speedDrawableFour, path: speedFourPath, ready: addSpeedFour}, 24);

        var speedDrawableFive = {
            id: 'speedFive',
            x: 320 / 16,
            y: 0 - speed.height / 2,
            img: speed
        };
        var speedFivePath = {
            startX: speedDrawableFive.x,
            startY: speedDrawableFive.y,
            endX: speedDrawableFive.x,
            endY: 480 + speed.height / 2,
            length: 480 + speed.height,
            duration: 30, //frames
            timingFn: Transition.LINEAR
        };

        function addSpeedFive() {
                renderer.remove(speedDrawableFive);
            speedDrawableFive = {
                id: 'speedFive',
                x: 320 / 16,
                y: 0 - speed.height / 2,
                img: speed
            };
            startScreen.add(speedDrawableFive, speedFivePath, addSpeedFive);
        }
        startScreenManager.throttleAdd({item: speedDrawableFive, path: speedFivePath, ready: addSpeedFive}, 16);


        var ship = atlasMapper.get('ship');
        var shipDrawable = {
            id: 'ship',
            x: 320 / 2,
            y: 480 / 3 * 2,
            img: ship
        };
        renderer.add(shipDrawable);

        var fireFrames = [];
        var i;
        for (i = 0; i <= 7; i++) {
            fireFrames.push(atlasMapper.get('fire-anim/fire_000' + i));
        }

        var fireSprite = new Sprite(fireFrames);
        var fireDrawable = {
            id: 'fire',
            x: 320 / 2,
            y: 480 / 3 * 2,
            sprite: fireSprite,
            img: fireFrames[0]
        };
        renderer.add(fireDrawable);

        var shieldsUpFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsUpFrames.push(atlasMapper.get("shields-up-anim/shields_up_000" + i));
        }

        var shieldsDownFrames = [];
        for (i = 0; i <= 5; i++) {
            shieldsDownFrames.push(atlasMapper.get("shields-down-anim/shields_down_000" + i));
        }

        var tapFrames = [];
        for (i = 0; i <= 35; i++) {
            if (i < 10) {
                tapFrames.push(atlasMapper.get("tap-anim/tap_000" + i));
            } else {
                tapFrames.push(atlasMapper.get("tap-anim/tap_00" + i));
            }
        }

        var getReadyFrames = [];
        for (i = 0; i <= 41; i++) {
            if (i < 10) {
                getReadyFrames.push(atlasMapper.get("ready-anim/get_ready_000" + i));
            } else {
                getReadyFrames.push(atlasMapper.get("ready-anim/get_ready_00" + i));
            }
        }

        var shieldStatic = atlasMapper.get("shield3");
        var ready3 = atlasMapper.get("ready3");
        var ready2 = atlasMapper.get("ready2");
        var ready1 = atlasMapper.get("ready1");

        var logoFrames = [];
        for (i = 0; i <= 43; i++) {
            if (i < 10) {
                getReadyFrames.push(atlasMapper.get("logo-anim/logo_000" + i));
            } else {
                getReadyFrames.push(atlasMapper.get("logo-anim/logo_00" + i));
            }
        }


//        startScreen.add(createScrollingBackElement(atlasMapper.get('title-screen-v001')), createTransitionPathForScrollingBackElement(atlasMapper.get('title-screen-v001'), screen), function() {
//
//            var logo = createLogoElement(screen, atlasMapper.get('ninja-cat-logo-v002'));
//
//            startScreen.add(logo, createTransitionPathForLogoElement(logo, screen), function () {
//
//                var start = createStartElement(screen, atlasMapper.get('start-target-v001'));
//
//                startScreen.add(start, createTransitionPathForStartElement(start, screen));
//
//                var desc = createDescElement(screen, atlasMapper.get('aim-fire-desc-v001'));
//
//                startScreenManager.throttleAdd({item: desc, path: createTransitionPathForDescElement(desc, screen)}, 10);
//
//                var changeToTouchElement = createTouchElement(screen, atlasMapper.get('change-touch-btn-v001'));
//
//                startScreenManager.throttleAdd({item: changeToTouchElement, path: createTransitionPathForTouchElement(changeToTouchElement, screen), ready: function () {
//
////                        startScreenInput.add(changeToTouchElement, function () {
////                            console.log("you touched the right spot!");
////                        });
//                }}, 15);
//            });
//        });

        var gameLoop = new GameLoop(this.requestAnimationFrame, renderer, startScreen, startScreenManager);
        gameLoop.run();

    };

    function createScrollingBackElement(backImg) {
        return {
            id: 'back',
            x: 0,
            y: -backImg.tileHeight / 2,
            img: backImg
        };
    }

    function createTransitionPathForScrollingBackElement(backImg) {
        return {
            startX: 0,
            startY: -backImg.tileHeight / 2,
            endX: 0,
            endY: 320 / 2,
            length: backImg.tileHeight,
            duration: 120, //frames
            timingFn: Transition.EASE_IN_OUT_EXPO
        };
    }

    function createLogoElement(screen, backImg) {
        return {
            id: 'logo',
            x: -backImg.width,
            y: Math.floor(screen.height / 2),
            img: backImg
        };
    }

    function createTransitionPathForLogoElement(logo, screen) {
        return {
            startX: logo.x,
            startY: logo.y,
            endX: Math.floor(screen.width / 3),
            endY: logo.y,
            length: Math.floor(logo.img.width + screen.width / 3),
            duration: 60,
            timingFn: Transition.EASE_IN_OUT_EXPO
        };
    }

    function createStartElement(screen, backImg) {
        return {
            id: 'start',
            x: -backImg.width / 2,
            y: Math.floor(screen.height / 3 * 2 - (backImg.width / 2)),
            img: backImg
        };
    }

    function createTransitionPathForStartElement(start, screen) {
        return {
            startX: start.x,
            startY: start.y,
            endX: Math.floor(screen.width / 6),
            endY: start.y,
            length: Math.floor(start.img.width + screen.width / 6),
            duration: 60,
            timingFn: Transition.EASE_IN_OUT_ELASTIC
        };
    }

    function createDescElement(screen, backImg) {
        return {
            id: 'desc',
            x: screen.width + backImg.width,
            y: Math.floor(screen.height / 3),
            img: backImg
        };
    }

    function createTransitionPathForDescElement(desc, screen) {
        return {
            startX: desc.x,
            startY: desc.y,
            endX: Math.floor(screen.width / 3 * 2),
            endY: desc.y,
            length: -Math.floor(desc.img.width + screen.width / 3),
            duration: 60,
            timingFn: Transition.EASE_IN_OUT_ELASTIC
        };
    }

    function createTouchElement(screen, backImg) {
        return {
            id: 'touch',
            x: screen.width + backImg.width / 2,
            y: Math.floor(screen.height / 3 * 2),
            img: backImg
        };
    }

    function createTransitionPathForTouchElement(touch, screen) {
        return {
            startX: touch.x,
            startY: touch.y,
            endX: Math.floor(screen.width / 3 * 2),
            endY: touch.y,
            length: -Math.floor(touch.img.width + screen.width / 3),
            duration: 60,
            timingFn: Transition.EASE_IN_OUT_ELASTIC
        };
    }

    return App;
})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition, Sprite);