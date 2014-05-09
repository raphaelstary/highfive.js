window.onload = function () {
    "use strict";

    var rAF = window.requestAnimationFrame.bind(window),
        screen = document.getElementById('screen'),
        ctx = screen.getContext('2d'),
        resizeBus = new ResizeBus(),
        screenSizer = new ScreenSizer(resizeBus, window.innerWidth, window.innerHeight),
        screenInput = new TapController(),
        app = new App(screen, ctx, rAF, resizeBus, screenInput),
        resizeHandler = new ResizeHandler(screenSizer, rAF);


    window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));

    screen.addEventListener('touchstart', screenInput.touchStart.bind(screenInput));
    screen.addEventListener('click', screenInput.click.bind(screenInput));

    app.start(window.innerWidth, window.innerHeight);
};