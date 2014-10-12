var App = (function (require) {
    "use strict";

    function App(gameServices) {
        this.screen = gameServices.screen;
        this.resizeBus = gameServices.resize;
        this.tapController = gameServices.tap;
        this.gameController = gameServices.pushRelease;
        this.gamePad = gameServices.gamePad;
        this.keyBoard = gameServices.keyBoard;
        this.keyPushRelease = gameServices.keyPushRelease;
    }

    App.prototype.start = function () {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene();
    };

    App.prototype._loadingScene = function () {
        // show loading screen, load binary resources

        var resourceLoader = new require.ResourceLoader(),
            initialScreen = new require.SimpleLoadingScreen(this.screen.getContext('2d'));

        require.GameResources.create(resourceLoader);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2);

        var self = this;
        resourceLoader.onComplete = function () {
            self.resizeBus.remove('initial_screen');
            
            var sceneServices = require.GameResources.process();
            
            var stage = self.__installStage(sceneServices.textures);
            var sceneManager = self._initScenes(stage, sceneServices.messages, sceneServices.sounds);
            self._doThePlay(sceneManager);
        };

        resourceLoader.load();
    };

    App.prototype.__installStage = function (textureCache) {

        var stage = new require.StageDirector(
            textureCache,
            new require.MotionDirector(new require.MotionStudio()),
            new require.SpriteAnimationDirector(new require.SpriteAnimationStudio()),
            new require.AnimationAssistant(new require.AnimationDirector(new require.AnimationStudio())),
            new require.AtlasRenderer(this.screen) // new require.ImageRenderer(this.screen)
        );

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        return stage;
    };

    App.prototype._startGameLoop = function (stage) {
        this.gameLoop = new require.GameLoop();
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._initScenes = function (stage, messages, sounds) {

        var sceneManager = new require.SceneManager();
        var self = this;
        var sceneServices = {
            stage: stage,
            messages: messages,
            sounds: sounds,
            tap: self.tap,
            pushRelease: self.pushRelease,
            dragNDrop: self.dragNDrop,
            keyBoard: self.keyBoard,
            gamePad: self.gamePad,
            keyPushRelease: self.keyPushRelease,
            loop: self.gameLoop
        };
        require.installScenes(sceneServices, sceneManager);

        return sceneManager;
    };

    App.prototype._doThePlay = function (sceneManager) {
        sceneManager.next();
    };

    return App;

})({
    ResourceLoader: ResourceLoader,
    SimpleLoadingScreen: SimpleLoadingScreen,
    ImageRenderer: ImageRenderer,
    AtlasRenderer: AtlasRenderer,
    GameLoop: GameLoop,
    SpriteAnimationDirector: SpriteAnimationDirector,
    SpriteAnimationStudio: SpriteAnimationStudio,
    MotionStudio: MotionStudio,
    MotionDirector: MotionDirector,
    AnimationStudio: AnimationStudio,
    AnimationDirector: AnimationDirector,
    AnimationAssistant: AnimationAssistant,
    StageDirector: StageDirector,
    SceneManager: SceneManager,
    FullScreenController: FullScreenController,
    UniversalTranslator: UniversalTranslator,
    SoundFilesManager: SoundFilesManager,
    SoundSpriteManager: SoundSpriteManager,
    TextureCache: TextureCache,
    AtlasMapper: AtlasMapper,
    GameResources: GameResources,
    installScenes: installScenes,
    resolveAtlasPaths: resolveAtlasPaths,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight
});
