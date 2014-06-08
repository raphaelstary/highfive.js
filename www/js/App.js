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
        this.showTutorial = true;
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
            var firstSceneFn;

//            if (DEBUG_START_IMMEDIATELY) {
//                firstSceneFn = self._preGameScene.bind(self);
//            } else {
            firstSceneFn = self._introScene.bind(self);
//            }

            self._initCommonSceneStuff(atlas, atlasInfo, windowWidth, firstSceneFn);
        };

        resourceLoader.load();
    };

    App.prototype._initCommonSceneStuff = function (atlas, atlasInfo, windowWidth, firstScene) {
        var atlasMapper = new require.AtlasMapper(1); // 1px is 1 tile length
        atlasMapper.init(atlasInfo, windowWidth);

        var stage = new require.StageDirector(atlasMapper, new require.MotionDirector(new require.MotionStudio()),
            new require.AnimationDirector(new require.AnimationStudio()), new require.Renderer(this.screen, this.screenCtx, atlas));

        this.resizeBus.add('stage', stage.resize.bind(stage));

        this._startGameLoop(stage);

        firstScene(stage);


    };

    App.prototype._introScene = function (stage) {

    };

    App.prototype._preGameScene = function (stage, logoDrawable, speedStripes) {

    };

    App.prototype._startGameLoop = function (stage) {
        this.gameLoop = new require.GameLoop(this.requestAnimationFrame);
        this.gameLoop.add('stage', stage.tick.bind(stage));
        this.gameLoop.run();
    };

    App.prototype._tutorialScene = function (stage, nxtSceneFn) {

        this.showTutorial = false;
    };

    App.prototype._getReadyScene = function (stage, nxtSceneFn) {

        if (this.showTutorial) {
            this._tutorialScene(stage, this._getReadyScene());
        } else {
            this._getReadyScene();
        }
    };

    App.prototype._startingPositionScene = function () {

    };

    App.prototype._playGameScene = function (stage, shipDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, energyBarDrawable, lifeOneDrawable, lifeTwoDrawable, lifeThreeDrawable, firstDigitDrawable, secondDigitDrawable, thirdDigitDrawable, fourthDigitDrawable, fireDrawable, speedStripes) {

    };

    App.prototype._endGameScene = function (stage, shipDrawable, fireDrawable, speedStripes, points, countDrawables) {


    };

    App.prototype._postGameScene = function (stage, points) {


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
    StageDirector: StageDirector
});