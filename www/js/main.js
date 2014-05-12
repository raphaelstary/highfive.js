window.onload = function () {
    "use strict";

    function installResizeHandler(rAF, resizeBus) {
        var screenSizer = new ScreenSizer(resizeBus, window.innerWidth, window.innerHeight),
            resizeHandler = new ResizeHandler(screenSizer, rAF);

        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
    }

    function installInputListeners(screenInput) {
        screen.addEventListener('touchstart', screenInput.touchStart.bind(screenInput));
        screen.addEventListener('click', screenInput.click.bind(screenInput));
    }

    function startApp(rAF, resizeBus, screenInput) {
        var screen = document.getElementById('screen'),
            ctx = screen.getContext('2d'),
            app = new App(screen, ctx, rAF, resizeBus, screenInput);

        app.start(window.innerWidth, window.innerHeight);
    }

    var rAF = window.requestAnimationFrame.bind(window),
        resizeBus = new ResizeBus(),
        screenInput = new TapController();

    installResizeHandler(rAF, resizeBus);
    installInputListeners(screenInput);
    startApp(rAF, resizeBus, screenInput);

};