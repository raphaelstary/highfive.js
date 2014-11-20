var App = (function ($) {
    "use strict";

    function App(services, myResources, getStage) {
        this.services = services;
        this.resources = myResources;
        this.getStage = getStage;
    }

    App.prototype.start = function () {
        // show loading screen, load binary resources

        var resourceLoader = new $.ResourceLoader(), initialScreen = new $.SimpleLoadingScreen(this.services.screen.getContext('2d'));

        var filesCount = this.resources.create(resourceLoader);

        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        if (this.services.resize)
            this.services.resize.add('initial_screen', initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(filesCount);

        var self = this;
        resourceLoader.onComplete = function () {
            if (self.services.resize)
                self.services.resize.remove('initial_screen');

            var sceneServices = self.resources.process();

            sceneServices.stage = self.getStage(self.services.screen, sceneServices.gfxCache, self.services.resize);
            sceneServices.loop = $.installLoop(sceneServices.stage);

            var timer = new $.CallbackTimer();
            sceneServices.loop.add('scene_timer', timer.update.bind(timer));
            sceneServices.timer = timer;

            sceneServices.fullScreen = new $.FullScreenController(self.services.screen);
            sceneServices.sceneStorage = {};

            $.concatenateProperties(self.services, sceneServices);

            self.scenes = $.installScenes(sceneServices);
            self.__run();
        };

        resourceLoader.load();
    };

    App.prototype.__run = function () {
        this.scenes.next();
    };

    return App;

})({
    ResourceLoader: ResourceLoader,
    SimpleLoadingScreen: SimpleLoadingScreen,
    installScenes: installMyScenes,
    FullScreenController: FullScreenController,
    installLoop: installLoop,
    concatenateProperties: concatenateProperties,
    CallbackTimer: CallbackTimer
});
