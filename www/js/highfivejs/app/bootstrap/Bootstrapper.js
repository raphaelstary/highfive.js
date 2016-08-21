H5.Bootstrapper = (function ($) {
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
        visibility: addPageVisibility,
        analytics: addAnalytics
    };

    // dependencies on screen, therefore flags because you need a screen first (build: screen -> features: with screen)
    var lowRezWidth;
    var lowRezHeight;
    var useLowRez = false;
    var useFullScreen = false;
    var usePointer = false;

    var events;
    var device;
    var removeKeyListener;
    // var isResponsive = false;
    var useAtlases = false;

    var noOneDidAnInit = true;

    function initBootstrap() {
        noOneDidAnInit = false;
        useLowRez = false;
        useFullScreen = false;
        usePointer = false;

        events = new $.EventBus();
        device = new $.Device($.userAgent, $.width, $.height, $.getDevicePixelRatio(), $.screenWidth, $.screenHeight);
        // isResponsive = false;
        useAtlases = false;
    }

    function buildApp(myResources, installMyScenes, id, optionalCanvas) {
        if (noOneDidAnInit)
            initBootstrap();

        var screen = useLowRez ?
            $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio(), lowRezWidth,
                lowRezHeight) : $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio());

        if (useLowRez) {
            device.width = lowRezWidth;
            device.height = lowRezHeight;
            device.isLowRez = true;
        }

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
        if (useAtlases) {
            getStage = $.StageFactory.getResponsiveAtlasStage;
        } else {
            getStage = $.StageFactory.getResponsiveImageStage;
        }

        // var getLegacyStage;
        // if (isResponsive && useAtlases) {
        //     getLegacyStage = $.StageFactory.getResponsiveAtlasLegacyStage;
        // } else if (isResponsive) {
        //     getLegacyStage = $.StageFactory.getResponsiveImageLegacyStage;
        // } else if (useAtlases) {
        //     getLegacyStage = $.StageFactory.getAtlasLegacyStage;
        // } else {
        //     getLegacyStage = $.StageFactory.getImageLegacyStage;
        // }
        var globalServices = {
            screen: screen.screen,
            events: events,
            device: device,
            scaledScreen: screen.scaledScreen,
            id: id
        };

        noOneDidAnInit = true;

        return new $.App(globalServices, myResources, installMyScenes, getStage, removeKeyListener);
    }

    function useAtlasesRendering() {
        if (noOneDidAnInit)
            initBootstrap();

        useAtlases = true;
        return Bootstrapper;
    }

    function addLowResolutionRendering(width, height) {
        if (noOneDidAnInit)
            initBootstrap();

        lowRezWidth = width;
        lowRezHeight = height;
        useLowRez = true;
        return Bootstrapper;
    }

    function addScreenOrientation() {
        if (noOneDidAnInit)
            initBootstrap();

        $.installOrientation(events, device);
        device.lockOrientation = $.OrientationLock.lock;
        device.unlockOrientation = $.OrientationLock.unlock;
        return Bootstrapper;
    }

    function addPageVisibility() {
        if (noOneDidAnInit)
            initBootstrap();

        $.installVisibility(events, device);
        return Bootstrapper;
    }

    function addFullScreen() {
        if (noOneDidAnInit)
            initBootstrap();

        useFullScreen = true;
        return Bootstrapper;
    }

    function addResize() {
        if (noOneDidAnInit)
            initBootstrap();

        $.installResize(events, device);
        // isResponsive = true;
        return Bootstrapper;
    }

    function addKeyBoard() {
        if (noOneDidAnInit)
            initBootstrap();

        removeKeyListener = $.installKeyBoard(events);
        return Bootstrapper;
    }

    function addGamePad() {
        if (noOneDidAnInit)
            initBootstrap();

        $.installGamePad(events);
        return Bootstrapper;
    }

    function addPointer() {
        if (noOneDidAnInit)
            initBootstrap();

        usePointer = true;
        return Bootstrapper;
    }

    function addAnalytics(url, tenantCode, appKeyCode) {
        if (noOneDidAnInit)
            initBootstrap();

        $.installAnalytics(url, tenantCode, appKeyCode, events);
        return Bootstrapper;
    }

    return Bootstrapper;
})({
    installCanvas: H5.installCanvas,
    StageFactory: H5.StageFactory,
    installResize: H5.installResize,
    installKeyBoard: H5.installKeyBoard,
    installGamePad: H5.installGamePad,
    installOrientation: H5.installOrientation,
    installFullScreen: H5.installFullScreen,
    installPointer: H5.installPointer,
    installVisibility: H5.installVisibility,
    installAnalytics: H5.installHolmes,
    App: H5.App,
    EventBus: H5.EventBus,
    Device: H5.Device,
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    getDevicePixelRatio: H5.getDevicePixelRatio,
    OrientationLock: H5.OrientationLock,
    userAgent: window.navigator.userAgent
});