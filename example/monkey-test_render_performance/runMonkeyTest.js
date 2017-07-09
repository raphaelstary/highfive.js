G.runMonkeyTest = (function (Width, Height, Event, Stats, Font, Math, Transition, range, GridViewHelper, location) {
    'use strict';

    var MonkeyFaceImages = [
        'monkey-1-face', 'monkey-2-face', 'monkey-3-face', 'monkey-4-face'
    ];
    var params = getUrlParams(location.search);
    var WIDTH_TILES = params.width ? parseInt(params.width) : 16 * 3;
    var HEIGHT_TILES = params.height ? parseInt(params.height) : 9 * 3;

    function runMonkeyTest(services) {
        var stage = services.stage;
        var events = services.events;
        var device = services.device;
        var sceneStorage = services.sceneStorage;

        events.subscribe(Event.TICK_START, Stats.start);
        events.subscribe(Event.TICK_END, Stats.end);

        sceneStorage.msTotal = 0;
        sceneStorage.msCount = 0;
        sceneStorage.fpsTotal = 0;
        sceneStorage.fpsCount = 0;

        var ms = stage.createText('0').setPosition(Width.get(10, 9), Height.get(20, 19))
            .setSize(Font._60).setZIndex(11).setColor('black');
        var fps = stage.createText('0').setPosition(Width.get(10, 9), Height.get(40, 39))
            .setSize(Font._60).setZIndex(11).setColor('black');

        events.subscribe(Event.TICK_CAMERA, function () {
            ms.data.msg = Stats.getMs().toString() + ' ms';
            fps.data.msg = Stats.getFps().toString() + ' fps';

            sceneStorage.msTotal += Stats.getMs();
            sceneStorage.msCount++;
            sceneStorage.fpsTotal += Stats.getFps();
            sceneStorage.fpsCount++;
        });

        var gridViewHelper = new GridViewHelper(stage, device, WIDTH_TILES, HEIGHT_TILES);
        startParade(gridViewHelper);
    }

    function startParade(gridViewHelper) {
        function rotateLeft(drawable) {
            drawable.rotateTo(-Math.PI / 6)
                .setDuration(30)
                .setSpacing(Transition.EASE_OUT_QUAD)
                .setCallback(rotateRight.bind(undefined, drawable));
        }

        function rotateRight(drawable) {
            drawable.rotateTo(Math.PI / 6)
                .setDuration(30)
                .setSpacing(Transition.EASE_OUT_QUAD)
                .setCallback(rotateLeft.bind(undefined, drawable));
        }

        var paradeTiles = [];

        for (var v = 0; v < HEIGHT_TILES; v++) {
            for (var u = 0; u < WIDTH_TILES; u++) {
                var randomMonkey = range(0, MonkeyFaceImages.length - 1);
                var drawable = gridViewHelper.createBackground(u, v, MonkeyFaceImages[randomMonkey], 3)
                    .setRotation(0);

                drawable.rotationAnchorOffsetY = drawable.getHeightHalf();

                rotateLeft(drawable);

                paradeTiles.push(drawable);
            }
        }
    }

    function getUrlParams(url) {
        var urlParams = {};
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            urlParams[key] = value;
        });
        return urlParams;
    }

    return runMonkeyTest;
})(H5.Width, H5.Height, H5.Event, H5.Stats, H5.Font, Math, H5.Transition, H5.range, H5.GridViewHelper, window.location);