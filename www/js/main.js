window.onload = function () {
    "use strict";

    function installResizeHandler(rAF, resizeBus) {
        var screenSizer = new ScreenSizer(resizeBus, window.innerWidth, window.innerHeight),
            resizeHandler = new ResizeHandler(screenSizer, rAF);

        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
    }

    function installInputListeners(screen, screenInput, gameController) {
        screen.addEventListener('touchstart', screenInput.touchStart.bind(screenInput));
        screen.addEventListener('click', screenInput.click.bind(screenInput));

        screen.addEventListener('touchstart', gameController.touchStart.bind(gameController));
        screen.addEventListener('touchend', gameController.touchEnd.bind(gameController));

        screen.addEventListener('mousedown', gameController.mouseDown.bind(gameController));
        screen.addEventListener('mouseup', gameController.mouseUp.bind(gameController));
    }

    function startApp(rAF, resizeBus, screenInput, gameController, screen) {
        var ctx = screen.getContext('2d'),
            app = new App(screen, ctx, rAF, resizeBus, screenInput, gameController);

        app.start(window.innerWidth, window.innerHeight);
    }

    var rAF = window.requestAnimationFrame.bind(window),
        resizeBus = new ResizeBus(),
        screenInput = new TapController(),
        screen = document.getElementById('screen'),
        gameController = new PushReleaseController();

    installResizeHandler(rAF, resizeBus);
    installInputListeners(screen, screenInput, gameController);
    startApp(rAF, resizeBus, screenInput, gameController, screen);
};