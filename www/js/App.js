var App = (function (require) {
    "use strict";
//    var DEBUG_START_IMMEDIATELY = false;
    function App(gameServices) {
        this.screen = gameServices.screen;
        this.resizeBus = gameServices.resize;
        this.tapController = gameServices.tap;
        this.gameController = gameServices.pushRelease;
    }

    App.prototype.start = function () {
        // idea to create list of all scenes and just use nextScene() to advance
        this._loadingScene();
    };

    App.prototype._loadingScene = function () {
        // show loading screen, load binary resources

        var resourceLoader = new require.ResourceLoader(),
            audioInfo = resourceLoader.addJSON('data/audio.json'),
            fontBlock = resourceLoader.addFont('data/kenpixel_blocks.woff'),
            font = resourceLoader.addFont('data/kenpixel.woff'),
            logoFont = resourceLoader.addFont('data/dooodleista.woff'),
            locales = resourceLoader.addJSON('data/locales.json'),
            initialScreen = new require.SimpleLoadingScreen(this.screen.getContext('2d'));

        var atlases = [];
        require.resolveAtlasPaths(require.screenWidth, require.screenHeight).forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        this.resizeBus.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(2);

        var self = this;
        resourceLoader.onComplete = function () {

            self.resizeBus.remove('initial_screen');

            var sceneStuff = self._initCommonSceneStuff(atlases, font, fontBlock, logoFont, locales, audioInfo);
            self._initScenes(sceneStuff.stage, sceneStuff.messages, sceneStuff.sounds);
            self._doThePlay();
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (atlases, font, fontBlock, logoFont, locales, audioInfo) {
        require.addFontToDOM([
            {name: 'KenPixel', url: require.URL.createObjectURL(font.blob)},
            {name: 'KenPixelBlocks', url: require.URL.createObjectURL(fontBlock.blob)},
            {name: 'LogoFont', url: require.URL.createObjectURL(logoFont.blob)}
        ]);

        var atlasMapper = new require.AtlasMapper();
        atlasMapper.init(atlases);

        var stage = new require.StageDirector(
            atlasMapper,
            new require.MotionDirector(new require.MotionStudio()),
            new require.SpriteAnimationDirector(new require.SpriteAnimationStudio()),
            new require.AnimationAssistant(new require.AnimationDirector(new require.AnimationStudio())),
            new require.AtlasRenderer(this.screen)
        );

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

//        var soundManager = new require.SoundFilesManager();
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

        var soundManager = new require.SoundSpriteManager();
        soundManager.load(audioInfo);

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
        var sceneStorage = {};

        var intro = new require.Intro(stage, sceneStorage, this.gameLoop, this.resizeBus);
        var preGame = new require.PreGame(stage, sceneStorage, this.tapController,
            new require.FullScreenController(this.screen), messages, this.resizeBus, sounds);
        var startingPosition = new require.StartingPosition(stage, sceneStorage, this.resizeBus, sounds);
        var inGameTutorial = new require.InGameTutorial(stage, sceneStorage, this.gameLoop, this.gameController,
            messages, this.tapController, this.resizeBus, sounds);
        var getReady = new require.GetReady(stage, sceneStorage, this.resizeBus);
        var playGame = new require.PlayGame(stage, sceneStorage, this.gameLoop, this.gameController, this.resizeBus,
            sounds);
        var killScreen = new require.KillScreen(stage, sceneStorage, this.resizeBus, sounds);
        var postGame = new require.PostGame(stage, sceneStorage, this.tapController, this.resizeBus, sounds);

        var sceneManager = this.sceneManager = new require.SceneManager();

        sceneManager.add(intro.show.bind(intro), true);
        sceneManager.add(preGame.show.bind(preGame), true);
        sceneManager.add(startingPosition.show.bind(startingPosition));
        sceneManager.add(inGameTutorial.show.bind(inGameTutorial), true);
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
    AtlasRenderer: AtlasRenderer,
    GameLoop: GameLoop,
    AtlasMapper: AtlasMapper,
    SpriteAnimationStudio: SpriteAnimationStudio,
    SpriteAnimationDirector: SpriteAnimationDirector,
    MotionStudio: MotionStudio,
    MotionDirector: MotionDirector,
    AnimationStudio: AnimationStudio,
    AnimationDirector: AnimationDirector,
    AnimationAssistant: AnimationAssistant,
    StageDirector: StageDirector,
    Intro: Intro,
    PreGame: PreGame,
    StartingPosition: StartingPosition,
    InGameTutorial: InGameTutorial,
    GetReady: GetReady,
    PlayGame: PlayGame,
    KillScreen: KillScreen,
    PostGame: PostGame,
    SceneManager: SceneManager,
    FullScreenController: FullScreenController,
    addFontToDOM: addFontToDOM,
    URL: window.URL || window.webkitURL,
    UniversalTranslator: UniversalTranslator,
    SoundFilesManager: SoundFilesManager,
    SoundSpriteManager: SoundSpriteManager,
    resolveAtlasPaths: resolveAtlasPaths,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight
});
