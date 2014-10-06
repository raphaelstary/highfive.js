var App = (function (require) {
    "use strict";

    function App(screen, resizeBus, screenInput) {
        this.screen = screen;
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
            locales = resourceLoader.addJSON('data/locales.json'),
            initialScreen = new require.SimpleLoadingScreen(this.screen.getContext('2d'));

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function () {

            self.resizeBus.remove('initial_screen');

            var textureCache = new require.TextureCache();

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
            new require.SpriteAnimationDirector(new require.SpriteAnimationStudio()),
            new require.AnimationAssistant(new require.AnimationDirector(new require.AnimationStudio())),
            new require.ImageRenderer(this.screen)
        );

        var stage = new require.ResizableStageDirector(stageDirector, textureCache, new require.Repository(),
            require.Touchables.get, require.fetchDrawableIntoTouchable,
            this.resizeBus.getWidth(), this.resizeBus.getHeight());

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        var soundManager = new require.SoundFilesManager();

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

        var theGame = new require.MainGame(stage, messages, sounds);

        var sceneManager = new require.SceneManager();

        sceneManager.add(theGame.show.bind(theGame));

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
    SpriteAnimationDirector: SpriteAnimationDirector,
    SpriteAnimationStudio: SpriteAnimationStudio,
    AnimationAssistant: AnimationAssistant,
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
    ResizableStageDirector: ResizableStageDirector,
    Repository: Repository,
    fetchDrawableIntoTouchable: fetchDrawableIntoTouchable,
    Touchables: Touchables,
    MainGame: MainGame
});
