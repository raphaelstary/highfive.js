window.onload = function () {
    "use strict";

    var rAF = window.requestAnimationFrame.bind(window),
        screen = document.getElementById('screen'),
        ctx = screen.getContext('2d'),
        resizeBus = new ResizeBus(),
        screenSizer = new ScreenSizer(resizeBus, window.innerWidth, window.innerHeight),
        app = new App(screen, ctx, rAF, resizeBus),
        resizeHandler = new ResizeHandler(screenSizer, rAF);


    window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));

    app.start(window.innerWidth, window.innerHeight);
};