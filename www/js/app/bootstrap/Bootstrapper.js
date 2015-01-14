var Bootstrapper = (function ($) {
    "use strict";

    var Bootstrapper = {
        build: buildApp,
        responsive: addResize,
        keyBoard: addKeyBoard,
        gamePad: addGamePad,
        atlas: useAtlasesRendering,
        orientation: addScreenOrientation,
        fullScreen: addFullScreen,
        pointer: addPointer
    };

    var screen = $.installCanvas($.width, $.height, $.getDevicePixelRatio());
    var events = new $.EventBus();
    var device = new $.DeviceInfo($.userAgent, $.width, $.height, $.getDevicePixelRatio());
    var isResponsive = false;
    var useAtlases = false;

    var globalServices = {
        screen: screen,
        events: events,
        device: device
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
        device.isFullScreenSupported = fs.__isSupported.bind(fs);
        device.exitFullScreen = fs.exit.bind(device);
        return Bootstrapper;
    }

    function addResize() {
        $.installResize(events, device);
        isResponsive = true;
        return Bootstrapper;
    }

    function addKeyBoard() {
        $.installKeyBoard(events);
        return Bootstrapper;
    }

    function addGamePad() {
        $.installGamePad(events);
        return Bootstrapper;
    }

    function addPointer() {
        $.installPointer(events, screen);
        return Bootstrapper;
    }

    return Bootstrapper;
})({
    installCanvas: installCanvas,
    StageFactory: StageFactory,
    installResize: installResize,
    installKeyBoard: installKeyBoard,
    installGamePad: installGamePad,
    installOrientation: installOrientation,
    installFullScreen: installFullScreen,
    installPointer: installPointer,
    App: App,
    EventBus: EventBus,
    DeviceInfo: DeviceInfo,
    width: window.innerWidth,
    height: window.innerHeight,
    getDevicePixelRatio: getDevicePixelRatio,
    OrientationLock: OrientationLock,
    userAgent: window.navigator.userAgent
});