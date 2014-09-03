var App = (function (require) {
    "use strict";

    function App(screen, screenCtx, resizeBus, screenInput) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
    }

    App.prototype.start = function () {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene(this.resizeBus.getWidth(), this.resizeBus.getHeight());
    };

    App.prototype._loadingScene = function (windowWidth, windowHeight) {
        // show loading screen, load binary resources

        var resourceLoader = new require.ResourceLoader(),
            baby = resourceLoader.addImage('gfx/baby.png'),
            baby_inside = resourceLoader.addImage('gfx/baby_inside.png'),
            cat = resourceLoader.addImage('gfx/cat.png'),
            cat_inside = resourceLoader.addImage('gfx/cat_inside.png'),
            firefighter = resourceLoader.addImage('gfx/firefighter.png'),
            granny = resourceLoader.addImage('gfx/granny.png'),
            granny_inside = resourceLoader.addImage('gfx/granny_inside.png'),
            ipad = resourceLoader.addImage('gfx/ipad.png'),
            ipad_inside = resourceLoader.addImage('gfx/ipad_inside.png'),
            lenovo = resourceLoader.addImage('gfx/lenovo.png'),
            lenovo_inside = resourceLoader.addImage('gfx/lenovo_inside.png'),
            scene = resourceLoader.addImage('gfx/scene.png'),
            sultan = resourceLoader.addImage('gfx/sultan.png'),
            sultan_inside = resourceLoader.addImage('gfx/sultan_inside.png'),
            locales = resourceLoader.addJSON('data/locales.json'),
            initialScreen = new require.SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function () {

            self.resizeBus.remove('initial_screen');

            var textureCache = new require.TextureCache();
            textureCache.add('baby', baby);
            textureCache.add('baby_inside', baby_inside);
            textureCache.add('cat', cat);
            textureCache.add('cat_inside', cat_inside);
            textureCache.add('firefighter', firefighter);
            textureCache.add('granny', granny);
            textureCache.add('granny_inside', granny_inside);
            textureCache.add('ipad', ipad);
            textureCache.add('ipad_inside', ipad_inside);
            textureCache.add('lenovo', lenovo);
            textureCache.add('lenovo_inside', lenovo_inside);
            textureCache.add('scene', scene);
            textureCache.add('sultan', sultan);
            textureCache.add('sultan_inside', sultan_inside);

            var sceneStuff = self._initCommonSceneStuff(textureCache, locales);
            var sceneManager = self._initScenes(sceneStuff.stage, sceneStuff.messages, sceneStuff.sounds);
            self._doThePlay(sceneManager);
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (textureCache, locales) {

        var stageDirector = new require.StageDirector(
            textureCache,
            new require.MotionDirector(new require.MotionStudio()),
            new require.AnimationDirector(new require.AnimationStudio()),
            new require.ImageRenderer(this.screen, this.screenCtx)
        );

        var stage = new require.ResizableStageDirector(stageDirector, textureCache, new require.Repository(),
            this.resizeBus.getWidth(), this.resizeBus.getHeight());

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        var soundManager = new require.SoundFilesManager();
//        soundManager.load(
//            [
//                'asteroid-explosion',
//                'click',
//                'coin',
//                'coin2',
//                'shields-down',
//                'shields-up',
//                'ship-explosion',
//                'star-explosion',
//                'star-taken'
//            ]
//        );

        return {
            stage: stage,
            messages: new require.UniversalTranslator(locales),
            sounds: soundManager
        };
    };

    App.prototype._startGameLoop = function (stage) {
        this.gameLoop = new require.GameLoop();
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._initScenes = function (stage, messages, sounds) {

        var fireGame = new require.FireGame(stage, this.gameLoop, this.tapController, messages, sounds, this.resizeBus);

        var sceneManager = new require.SceneManager();

        sceneManager.add(fireGame.show.bind(fireGame));

        return sceneManager;
    };

    App.prototype._doThePlay = function (sceneManager) {
        sceneManager.next();
    };

    return App;

})({
    ResourceLoader: ResourceLoader,
    SimpleLoadingScreen: SimpleLoadingScreen,
    AtlasRenderer: AtlasRenderer,
    ImageRenderer: ImageRenderer,
    GameLoop: GameLoop,
    AtlasMapper: AtlasMapper,
    AnimationStudio: AnimationStudio,
    AnimationDirector: AnimationDirector,
    MotionStudio: MotionStudio,
    MotionDirector: MotionDirector,
    StageDirector: StageDirector,
    SceneManager: SceneManager,
    FullScreenController: FullScreenController,
    addFontToDOM: addFontToDOM,
    URL: window.URL || window.webkitURL,
    UniversalTranslator: UniversalTranslator,
    SoundFilesManager: SoundFilesManager,
    SoundSpriteManager: SoundSpriteManager,
    TextureCache: TextureCache,
    FireGame: FireGame,
    ResizableStageDirector: ResizableStageDirector,
    Repository: Repository
});