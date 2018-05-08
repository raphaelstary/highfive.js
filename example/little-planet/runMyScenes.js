G.runMyScenes = (function (Width, Height, Math, Vectors, Event, setupFPSMeter) {
    'use strict';

    var TILES_COUNT = 28;
    var ARC_ANGLE = Math.PI * 2 / TILES_COUNT;
    var PI_HALF = Math.PI / 2;
    var TWO_PI = Math.PI * 2;

    function runMyScenes(services) {
        var visuals = services.visuals;
        var device = services.device;

        function getRadius(width, height) {
            if (width < height) {
                return Math.floor(width / 3);
            }
            return Math.floor(height / 3);
        }

        function getOuterRadius(width, height) {
            return Math.floor(getRadius(width, height) * 1.08);// 0.88);
        }

        function getTileLength(width, height) {
            var planetOuterRadius = getOuterRadius(width, height);
            var circumference = TWO_PI * planetOuterRadius;
            var arcLength = circumference / TILES_COUNT;
            return Math.floor(arcLength * 0.8);
        }

        function getTileWidth(height, width) {
            return getTileLength(width, height);
        }

        function getTileHeight(height, width) {
            return getTileLength(width, height);
        }

        function getTileX(number) {
            return function (width, height) {
                var angle = ARC_ANGLE * number + planet.rotation;
                return Vectors.getX(Width.HALF(width), getOuterRadius(width, height), angle);
            };
        }

        function getTileY(number) {
            return function (height, width) {
                var angle = ARC_ANGLE * number + planet.rotation;
                return Vectors.getY(Height.HALF(height), getOuterRadius(width, height), angle);
            };
        }

        var planet = visuals.createCircle(true)
            .setColor('#6495ED')
            .setPosition(Width.HALF, Height.HALF)
            .setRotation(0)
            .setRadius(getRadius);

        var tiles = [];
        for (var i = 0; i < TILES_COUNT; i++) {
            var rotation = ARC_ANGLE * i + PI_HALF;
            tiles.push(visuals.createRectangle(true)
                .setColor('#519657')
                .setPosition(getTileX(i), getTileY(i))
                .setRotation(rotation)
                .setWidth(getTileWidth)
                .setHeight(getTileHeight));
        }

        services.events.subscribe(Event.TICK_CAMERA, function () {
            planet.rotation -= 0.0005;

            tiles.forEach(function (tile, i) {
                tile.x = getTileX(i)(device.width, device.height);
                tile.y = getTileY(i)(device.height, device.width);
                tile.rotation = ARC_ANGLE * i + PI_HALF + planet.rotation;
            });
        });

        var selected;
        services.events.subscribe(Event.POINTER, function (pointer) {
            if (pointer.type != 'up') {
                return;
            }
            var angle = Vectors.getAngle(pointer.x, pointer.y, Width.HALF(device.width), Height.HALF(device.height));

            var tileNr = Math.floor((angle - planet.rotation) / ARC_ANGLE + 0.5);

            console.log(tileNr);

            var min = 0;
            var max = 27;
            var range = max + 1;

            if (Math.abs(tileNr) > max) {
                tileNr = tileNr % range;
            }
            if (tileNr < min) {
                tileNr = tileNr + range;
            }

            var tile = tiles[tileNr];
            if (tile) {
                if (selected) {
                    selected.setColor('#519657');
                }

                tile.setColor('#b2fab4');
                selected = tile;
            }
        });

        setupFPSMeter(services);
    }

    return runMyScenes;
})(H5.Width, H5.Height, Math, H5.Vectors, H5.Event, H5.setupFPSMeter);
