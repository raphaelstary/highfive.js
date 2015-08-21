var App = (function ($) {
    "use strict";

    function App(services, myResources, getLegacyStage, getStage) {
        this.services = services;
        this.resources = myResources;
        this.getStage = getLegacyStage;
        this.getNewStage = getStage;
    }

    App.prototype.start = function () {
        // show loading screen, load binary resources

        var resourceLoader = new $.ResourceLoader();
        var initialScreen = new $.SimpleLoadingScreen(this.services.screen.getContext('2d'));

        var filesCount = this.resources.create(resourceLoader);
        var events = this.services.events;
        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        var initScreenId = events.subscribe($.Event.RESIZE, initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(filesCount);

        var self = this;
        resourceLoader.onComplete = function () {
            events.unsubscribe(initScreenId);

            var sceneServices = self.resources.process();

            sceneServices.stage = self.getStage(self.services.screen, sceneServices.gfxCache, self.services.device,
                events);
            var stages = [sceneServices.stage];
            if (self.getNewStage) {
                sceneServices.newStage = self.getNewStage(self.services.screen, sceneServices.gfxCache,
                    self.services.device, events);
                //if (sceneServices.newStage)
                //    stages.push(sceneServices.newStage);
            }
            sceneServices.loop = $.installLoop(stages, events);

            var timer = new $.CallbackTimer();
            events.subscribe($.Event.TICK_MOVE, timer.update.bind(timer));
            sceneServices.timer = timer;

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
    installLoop: installLoop,
    concatenateProperties: concatenateProperties,
    CallbackTimer: CallbackTimer,
    Event: Event
});