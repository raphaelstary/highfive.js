window.onload = function () {
    "use strict";

    function installResizeHandler(resizeBus) {
        var screenSizer = new ScreenSizer(resizeBus, window.innerWidth, window.innerHeight),
            resizeHandler = new ResizeHandler(screenSizer);

        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
    }

    function installInputListeners(screen, screenInput) {
        if ('ontouchstart' in window) {
            screen.addEventListener('touchstart', screenInput.touchStart.bind(screenInput));
        }

        if(window.PointerEvent) {
            screen.addEventListener('pointerdown', screenInput.click.bind(screenInput));

        } else if (window.MSPointerEvent) {
            screen.addEventListener('MSPointerDown', screenInput.click.bind(screenInput));

        } else {
            screen.addEventListener('click', screenInput.click.bind(screenInput));
        }
    }

    function startApp(resizeBus, screenInput, screen) {
        var ctx = screen.getContext('2d'),
            app = new App(screen, ctx, resizeBus, screenInput);

        app.start(window.innerWidth, window.innerHeight);
    }

    var resizeBus = new ResizeBus(),
        screenInput = new TapController(),
        screen = document.getElementById('screen');

    installResizeHandler(resizeBus);
    installInputListeners(screen, screenInput);
    startApp(resizeBus, screenInput, screen);
};