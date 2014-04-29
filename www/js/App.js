var App = (function (ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition) {

    function App(screen, screenCtx, requestAnimationFrame, resizeBus) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
    }

    App.prototype.start = function (windowWidth, windowHeight) {

        var resourceLoader = new ResourceLoader(),
            preGameAtlas = resourceLoader.addImage('gfx/pregame-atlas.png'),
            preGameAtlasInfo = resourceLoader.addJSON('data/pregame-atlas.json'),
            initialScreen = new SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function startMenu() {
            self.resizeBus.remove('initial_screen');

            var preGameAtlasMapper = new AtlasMapper(1920/480);
            preGameAtlasMapper.init(preGameAtlasInfo, windowWidth);
            self.resizeBus.add('pre_game_mapper', preGameAtlasMapper.resize.bind(preGameAtlasMapper));

            var preGameRenderer = new Renderer(self.screen, self.screenCtx, preGameAtlas);
            self.resizeBus.add('pre_game_renderer', preGameRenderer.resize.bind(preGameRenderer));

            var startScreen = new Scene(preGameRenderer),
                startScreenManager = new SceneManager(startScreen);

            startScreen.add(createScrollingBackElement(preGameAtlasMapper.get('title-screen-v001')), createTransitionPathForScrollingBackElement(preGameAtlasMapper.get('title-screen-v001'), screen), function() {

                var logo = createLogoElement(screen, preGameAtlasMapper.get('ninja-cat-logo-v002'));

                startScreen.add(logo, createTransitionPathForLogoElement(logo, screen), function () {

                    var start = createStartElement(screen, preGameAtlasMapper.get('start-target-v001'));

                    startScreen.add(start, createTransitionPathForStartElement(start, screen));

                    var desc = createDescElement(screen, preGameAtlasMapper.get('aim-fire-desc-v001'));

                    startScreenManager.throttleAdd({item: desc, path: createTransitionPathForDescElement(desc, screen)}, 10);

                    var changeToTouchElement = createTouchElement(screen, preGameAtlasMapper.get('change-touch-btn-v001'));

                    startScreenManager.throttleAdd({item: changeToTouchElement, path: createTransitionPathForTouchElement(changeToTouchElement, screen), ready: function () {

//                        startScreenInput.add(changeToTouchElement, function () {
//                            console.log("you touched the right spot!");
//                        });
                    }}, 15);
                });
            });

            var preGameLoop = new GameLoop(self.requestAnimationFrame, preGameRenderer, startScreen, startScreenManager);
            preGameLoop.run();
        };

        resourceLoader.load();
    };

    function createScrollingBackElement(backImg) {
        return {
            id: 'back',
            x: 0,
            y: - backImg.tileHeight / 2,
            img: backImg
        };
    }

    function createTransitionPathForScrollingBackElement(backImg) {
        return {
            startX: 0,
            startY: - backImg.tileHeight / 2,
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
})(ResourceLoader, SimpleLoadingScreen, Renderer, GameLoop, AtlasMapper, Transition);