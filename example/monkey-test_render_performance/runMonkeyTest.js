G.runMonkeyTest = (function (Width, Height, Event, setupFPSMeter, Math, Transition, range, GridViewHelper, location) {
    'use strict';

    var MonkeyFaceImages = [
        'monkey-1-face',
        'monkey-2-face',
        'monkey-3-face',
        'monkey-4-face'
    ];
    var params = getUrlParams(location.search);
    var WIDTH_TILES = params.width ? parseInt(params.width) : 16 * 3;
    var HEIGHT_TILES = params.height ? parseInt(params.height) : 9 * 3;

    function runMonkeyTest(services) {
        var visuals = services.visuals;
        var device = services.device;

        setupFPSMeter(services);

        var gridViewHelper = new GridViewHelper(visuals, device, WIDTH_TILES, HEIGHT_TILES);
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
})(H5.Width, H5.Height, H5.Event, H5.setupFPSMeter, Math, H5.Transition, H5.range, H5.GridViewHelper, window.location);
