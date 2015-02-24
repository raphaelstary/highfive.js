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
        pointer: addPointer,
        lowRez: addLowResolutionRendering,
        visibility: addPageVisibility
    };

    // dependencies on screen, therefore flags because you need a screen first (build: screen -> features: with screen)
    var lowRezWidth;
    var lowRezHeight;
    var useLowRez = false;
    var useFullScreen = false;
    var usePointer = false;

    var events = new $.EventBus();
    var device = new $.DeviceInfo($.userAgent, $.width, $.height, $.getDevicePixelRatio());
    var isResponsive = false;
    var useAtlases = false;

    function buildApp(myResources) {
        var screen = useLowRez ?
            $.installCanvas(events, device, $.width, $.height, $.getDevicePixelRatio(), lowRezWidth, lowRezHeight) :
            $.installCanvas(events, device, $.width, $.height, $.getDevicePixelRatio());

        if (useFullScreen) {
            var fs = $.installFullScreen(useLowRez ? screen.scaledScreen : screen.screen, events);
            device.requestFullScreen = fs.request.bind(fs);
            device.isFullScreen = fs.isFullScreen.bind(fs);
            device.isFullScreenSupported = fs.__isSupported.bind(fs);
            device.exitFullScreen = fs.exit.bind(device);
        }

        if (usePointer) {
            $.installPointer(events, device, useLowRez ? screen.scaledScreen : screen.screen);
        }

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
        var globalServices = {
            screen: screen.screen,
            events: events,
            device: device,
            scaledScreen: screen.scaledScreen
        };
        return new $.App(globalServices, myResources, getStage);
    }

    function useAtlasesRendering() {
        useAtlases = true;
        return Bootstrapper;
    }

    function addLowResolutionRendering(width, height) {
        lowRezWidth = width;
        lowRezHeight = height;
        useLowRez = true;
        return Bootstrapper;
    }

    function addScreenOrientation() {
        $.installOrientation(events, device);
        device.lockOrientation = $.OrientationLock.lock;
        device.unlockOrientation = $.OrientationLock.unlock;
        return Bootstrapper;
    }

    function addPageVisibility() {
        $.installVisibility(events, device);
        return Bootstrapper;
    }

    function addFullScreen() {
        useFullScreen = true;
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
        usePointer = true;
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
    installVisibility: installVisibility,
    App: App,
    EventBus: EventBus,
    DeviceInfo: DeviceInfo,
    width: window.innerWidth,
    height: window.innerHeight,
    getDevicePixelRatio: getDevicePixelRatio,
    OrientationLock: OrientationLock,
    userAgent: window.navigator.userAgent
});