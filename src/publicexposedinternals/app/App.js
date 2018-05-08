H5.App = (function (ResourceLoader, SimpleLoadingScreen, installLoop, concatenateProperties, CallbackTimer, Event,
    getStage) {
    'use strict';

    function App(services, resourcesLoadingQueue, runMyScenes, removeKeyHandler, removeWheelHandler) {
        this.services = services;
        this.resourcesQueue = resourcesLoadingQueue;
        this.runMyScenes = runMyScenes;
        this.removeKeyHandler = removeKeyHandler;
        this.removeWheelHandler = removeWheelHandler;
    }

    App.prototype.start = function (appInfo, hideLoadingScreen, callback) {
        // show loading screen, load binary resources
        var resourceLoader = new ResourceLoader();

        this.resourcesQueue.forEach(function (loader) {
            loader.load(resourceLoader);
        });
        var filesCount = resourceLoader.getCount();

        var events = this.services.events;
        if (!hideLoadingScreen) {
            var initialScreen = new SimpleLoadingScreen(this.services.screen.getContext('2d'));
            resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
            var initScreenId = events.subscribe(Event.RESIZE, initialScreen.resize.bind(initialScreen));
            initialScreen.showNew(filesCount);
        }

        var self = this;
        resourceLoader.onComplete = function () {
            if (!hideLoadingScreen) {
                events.unsubscribe(initScreenId);
            }

            var sceneServices = {};

            self.resourcesQueue.forEach(function (loader) {
                if (loader.process) {
                    loader.process(sceneServices);
                }
            });

            sceneServices.visuals = getStage(self.services.screen, sceneServices.gfxCache, self.services.device,
                events);

            /**
             * @deprecated use services.visuals instead
             */
            sceneServices.stage = sceneServices.visuals;
            sceneServices.loop = self.loop = installLoop(sceneServices.visuals, events);

            var timer = new CallbackTimer();
            events.subscribe(Event.TICK_START, timer.update.bind(timer));
            sceneServices.timer = timer;

            sceneServices.sceneStorage = {};
            sceneServices.sceneStorage.endCallback = function () {
                self.stop();
                if (self.removeKeyHandler) {
                    self.removeKeyHandler();
                }
                if (self.removeWheelHandler) {
                    self.removeWheelHandler();
                }
                if (self.services.device.isFullScreen()) {
                    self.services.device.exitFullScreen();
                }
                if (callback) {
                    callback();
                }
            };

            concatenateProperties(self.services, sceneServices);
            sceneServices.info = appInfo;

            self.resourcesQueue.forEach(function (loader) {
                if (loader.postProcess) {
                    loader.postProcess(sceneServices);
                }
            });

            self.runMyScenes(sceneServices);
        };

        resourceLoader.load();
    };

    App.prototype.stop = function () {
        this.loop.stop();
    };

    return App;

})(H5.ResourceLoader, H5.SimpleLoadingScreen, H5.installLoop, H5.concatenateProperties, H5.CallbackTimer, H5.Event,
    H5.getStage);
