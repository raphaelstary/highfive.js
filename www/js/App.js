var App = (function (require) {
    "use strict";
//    var DEBUG_START_IMMEDIATELY = false;

    function App(screen, screenCtx, requestAnimationFrame, resizeBus, screenInput, gameController) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.requestAnimationFrame = requestAnimationFrame;
        this.resizeBus = resizeBus;
        this.tapController = screenInput;
        this.gameController = gameController;
    }

    App.prototype.start = function (windowWidth, windowHeight) {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene(windowWidth, windowHeight);
    };

    App.prototype._loadingScene = function (windowWidth, windowHeight) {
        // show loading screen, load binary resources

        var resourceLoader = new require.ResourceLoader(),
            atlas = resourceLoader.addImage('gfx/atlas.png'),
            atlasInfo = resourceLoader.addJSON('data/atlas.json'),
            initialScreen = new require.SimpleLoadingScreen(this.screenCtx);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2, windowWidth, windowHeight);

        var self = this;
        resourceLoader.onComplete = function () {

            self.resizeBus.remove('initial_screen');

            var stage = self._initCommonSceneStuff(atlas, atlasInfo, windowWidth);
            self._initScenes(stage);
            self._doThePlay();
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (atlas, atlasInfo, windowWidth) {
        var atlasMapper = new require.AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);

        var stage = new require.StageDirector(atlasMapper, new require.MotionDirector(new require.MotionStudio()),
            new require.AnimationDirector(new require.AnimationStudio()), new require.Renderer(this.screen, this.screenCtx, atlas));

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        return stage;
    };

    App.prototype._startGameLoop = function (stage) {
        this.gameLoop = new require.GameLoop(this.requestAnimationFrame);
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._initScenes = function (stage) {
        var sceneStorage = {};

        var intro = new require.Intro(stage, sceneStorage, this.gameLoop);
        var preGame = new require.PreGame(stage, sceneStorage, this.tapController);
        var startingPosition = new require.StartingPosition(stage, sceneStorage);
        var tutorial = new require.Tutorial(stage, this.tapController);
        var getReady = new require.GetReady(stage);
        var playGame = new require.PlayGame(stage, sceneStorage, this.gameLoop, this.gameController);
        var killScreen = new require.KillScreen(stage, sceneStorage);
        var postGame = new require.PostGame(stage, sceneStorage, this.tapController);

        var sceneManager = this.sceneManager = new SceneManager();

        sceneManager.add(intro.show.bind(intro), true);
        sceneManager.add(preGame.show.bind(preGame), true);
        sceneManager.add(startingPosition.show.bind(startingPosition));
        sceneManager.add(tutorial.show.bind(tutorial), true);
        sceneManager.add(getReady.show.bind(getReady));
        sceneManager.add(playGame.show.bind(playGame));
        sceneManager.add(killScreen.show.bind(killScreen));
        sceneManager.add(postGame.show.bind(postGame));
    };

    App.prototype._doThePlay = function () {
        this.sceneManager.next();
    };

    return App;

})({
    ResourceLoader: ResourceLoader,
    SimpleLoadingScreen: SimpleLoadingScreen,
    Renderer: Renderer,
    GameLoop: GameLoop,
    AtlasMapper: AtlasMapper,
    AnimationStudio: AnimationStudio,
    AnimationDirector: AnimationDirector,
    MotionStudio: MotionStudio,
    MotionDirector: MotionDirector,
    StageDirector: StageDirector,
    Intro: Intro,
    PreGame: PreGame,
    StartingPosition: StartingPosition,
    Tutorial: Tutorial,
    GetReady: GetReady,
    PlayGame: PlayGame,
    KillScreen: KillScreen,
    PostGame: PostGame,
    SceneManager: SceneManager
});