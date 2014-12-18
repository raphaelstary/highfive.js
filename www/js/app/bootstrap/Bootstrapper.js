var Bootstrapper = (function ($) {
    "use strict";

    var Bootstrapper = {
        build: buildApp,
        responsive: addResize,
        tap: addTap,
        pushRelease: addPushRelease,
        keyBoard: addKeyBoard,
        gamePad: addGamePad,
        keyPushRelease: addKeyPushRelease,
        dragNDrop: addDragNDrop,
        atlas: useAtlasesRendering,
        orientation: addScreenOrientation,
        fullScreen: addFullScreen
    };

    var screen = $.installCanvas();
    var events = new $.EventBus();
    var device = new $.DeviceInfo($.userAgent);
    var isResponsive = false;
    var useAtlases = false;

    var globalServices = {
        screen: screen
    };

    function buildApp(myResources) {
        var getStage;
        if (isResponsive && useAtlases) {
            getStage = $.StageFactory.getResponsiveAtlasStage;
        } else if (isResponsive) {
            getStage = $.StageFactory.getResponsiveImageStage;
        } else if (useAtlases) {
            getStage = $.StageFactory.getAtlasStage;
        } else {
            getStage = $.StageFactory.getImageStage;
        }

        return new $.App(globalServices, myResources, getStage);
    }

    function useAtlasesRendering() {
        useAtlases = true;
        return Bootstrapper;
    }

    function addScreenOrientation() {
        $.installOrientation(events, device);
        device.lockOrientation = $.OrientationLock.lock;
        device.unlockOrientation = $.OrientationLock.unlock;
        return Bootstrapper;
    }

    function addFullScreen() {
        var fs = $.installFullScreen(screen, events);
        device.requestFullScreen = fs.request.bind(fs);
        device.isFullScreen = fs.isFullScreen.bind(fs);
        device.isFullScreenSupported = fs.isSupported.bind(fs);
        device.exitFullScreen = fs.exit.bind(device);
        return Bootstrapper;
    }

    function addResize() {
        $.installResize(events, device);
        var self = this;
        device.forceResize = function () {
            self.events.fire(Event.RESIZE, {
                width: this.width,
                height: this.height,
                cssWidth: this.cssWidth,
                cssHeight: this.cssHeight,
                devicePixelRatio: this.devicePixelRatio
            });
        };
        isResponsive = true;
        return Bootstrapper;
    }

    function addTap() {
        globalServices.tap = $.installTap(screen);
        return Bootstrapper;
    }

    function addPushRelease() {
        globalServices.pushRelease = $.installPushRelease(screen);
        return Bootstrapper;
    }

    function addKeyBoard() {
        globalServices.keyBoard = $.installKeyBoard();
        return Bootstrapper;
    }

    function addGamePad() {
        globalServices.gamePad = $.installGamePad();
        return Bootstrapper;
    }

    function addKeyPushRelease() {
        globalServices.keyPushRelease = $.installKeyPushRelease();
        return Bootstrapper;
    }

    function addDragNDrop() {
        globalServices.dragNDrop = $.installDragNDrop(screen);
        return Bootstrapper;
    }

    return Bootstrapper;
})({
    installCanvas: installCanvas,
    StageFactory: StageFactory,
    installResize: installResize,
    installTap: installTap,
    installPushRelease: installPushRelease,
    installKeyBoard: installKeyBoard,
    installGamePad: installGamePad,
    installKeyPushRelease: installKeyPushRelease,
    installDragNDrop: installDragNDrop,
    installOrientation: installOrientation,
    installFullScreen: installFullScreen,
    App: App,
    EventBus: EventBus,
    DeviceInfo: DeviceInfo,
    width: window.innerWidth,
    height: window.innerHeight,
    getDevicePixelRatio: getDevicePixelRatio,
    OrientationLock: OrientationLock
});