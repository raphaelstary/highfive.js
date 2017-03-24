H5.Bootstrapper = (function ($) {
    'use strict';

    var Bootstrapper = {
        build: buildApp,

        // controls - choose [0...n]
        keyBoard: addKeyBoard,
        gamePad: addGamePad,
        pointer: addPointer,

        // system-services / device-events - choose [0...n]
        orientation: addScreenOrientation,
        visibility: addPageVisibility,
        fullScreen: addFullScreen,

        // rendering - choose [1]
        atlas: useAtlasRendering,
        fixedRezAtlas: useFixedRezAtlasRendering,
        image: useImageRendering,

        // screen (size) - choose [0...n]
        responsive: addResize,
        lowRez: addLowResolutionRendering,

        // font - choose [0|1]
        font: useFont,
        ejectaFont: useEjectaFont,

        // framework services - choose [0...n]
        analytics: addAnalytics,
        locales: useLocales,
        scenes: useH5Scenes,

        // audio - choose [0|1]
        webAudioSprite: useWebAudioSprite,
        htmlAudio: useHtmlAudio,
        htmlAudioSprite: useHtmlAudioSprite
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
    var noOneDidAnInit = true;
    var resourceLoadingQueue;

    function initBootstrap() {
        noOneDidAnInit = false;
        useLowRez = false;
        useFullScreen = false;
        usePointer = false;

        events = new $.EventBus();
        device = new $.Device($.userAgent, $.width, $.height, $.getDevicePixelRatio(), $.screenWidth, $.screenHeight);

        resourceLoadingQueue = [];
    }

    function buildApp(myResources, installMyScenes, optionalCanvas) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        var screen = useLowRez ?
            $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio(), lowRezWidth,
                lowRezHeight) :
            $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio());

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

        var globalServices = {
            screen: screen.screen,
            events: events,
            device: device,
            scaledScreen: screen.scaledScreen
        };

        noOneDidAnInit = true;

        resourceLoadingQueue.push(myResources);

        return new $.App(globalServices, resourceLoadingQueue, installMyScenes, removeKeyListener);
    }

    function addLowResolutionRendering(width, height) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        lowRezWidth = width;
        lowRezHeight = height;
        useLowRez = true;
        return Bootstrapper;
    }

    function addScreenOrientation() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installOrientation(events, device);
        device.lockOrientation = $.OrientationLock.lock;
        device.unlockOrientation = $.OrientationLock.unlock;
        return Bootstrapper;
    }

    function addPageVisibility() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installVisibility(events, device);
        return Bootstrapper;
    }

    function addFullScreen() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        useFullScreen = true;
        return Bootstrapper;
    }

    function addResize() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installResize(events, device);
        return Bootstrapper;
    }

    function addKeyBoard() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        removeKeyListener = $.installKeyBoard(events);
        return Bootstrapper;
    }

    function addGamePad() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installGamePad(events);
        return Bootstrapper;
    }

    function addPointer() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        usePointer = true;
        return Bootstrapper;
    }

    function addAnalytics(url, tenantCode, appKeyCode) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installAnalytics(url, tenantCode, appKeyCode, events);
        return Bootstrapper;
    }

    function useAtlasRendering(registerPaths) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.AtlasLoader.register(registerPaths);
        resourceLoadingQueue.push($.AtlasLoader);
        return Bootstrapper;
    }

    function useEjectaFont(path) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.EjectaFontLoader.register(path);
        resourceLoadingQueue.push($.EjectaFontLoader);
        return Bootstrapper;
    }

    function useFixedRezAtlasRendering(width, height, optionalBaseName, optionalGfxPath, optionalDataPath,
        optionalGfxExtension, optionalDataExtension) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.FixedRezAtlasLoader.register(width, height, optionalBaseName, optionalGfxPath, optionalDataPath,
            optionalGfxExtension, optionalDataExtension);
        resourceLoadingQueue.push($.FixedRezAtlasLoader);
        return Bootstrapper;
    }

    function useFont(path, name) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.FontLoader.register(path, name);
        resourceLoadingQueue.push($.FontLoader);
        return Bootstrapper;
    }

    function useHtmlAudio(soundNamesToPathsDict, optionalPath, optionalExtension) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.HtmlAudioLoader.register(soundNamesToPathsDict, optionalPath, optionalExtension);
        resourceLoadingQueue.push($.HtmlAudioLoader);
        return Bootstrapper;
    }

    function useHtmlAudioSprite(musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.HtmlAudioSpriteLoader.register(musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount);
        resourceLoadingQueue.push($.HtmlAudioSpriteLoader);
        return Bootstrapper;
    }

    function useImageRendering(notImplementedYet) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.ImageLoader.register(notImplementedYet);
        resourceLoadingQueue.push($.ImageLoader);
        return Bootstrapper;
    }

    function useLocales(path) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.LocalesLoader.register(path);
        resourceLoadingQueue.push($.LocalesLoader);
        return Bootstrapper;
    }

    function useH5Scenes(path) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.SceneLoader.register(path);
        resourceLoadingQueue.push($.SceneLoader);
        return Bootstrapper;
    }

    function useWebAudioSprite(musicInfoPath, musicPath, sfxInfoPath, sfxPath) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.WebAudioSpriteLoader.register(musicInfoPath, musicPath, sfxInfoPath, sfxPath);
        resourceLoadingQueue.push($.WebAudioSpriteLoader);
        return Bootstrapper;
    }

    return Bootstrapper;
})({
    installCanvas: H5.installCanvas,
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
    userAgent: window.navigator.userAgent,
    AtlasLoader: H5.AtlasLoader,
    EjectaFontLoader: H5.EjectaFontLoader,
    FixedRezAtlasLoader: H5.FixedRezAtlasLoader,
    FontLoader: H5.FontLoader,
    HtmlAudioLoader: H5.HtmlAudioLoader,
    HtmlAudioSpriteLoader: H5.HtmlAudioSpriteLoader,
    ImageLoader: H5.ImageLoader,
    LocalesLoader: H5.LocalesLoader,
    SceneLoader: H5.SceneLoader,
    WebAudioSpriteLoader: H5.WebAudioSpriteLoader
});