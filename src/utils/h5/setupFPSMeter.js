H5.setupFPSMeter = (function (Event, Stats, Width, Height, Font) {
    'use strict';

    function setupFPSMeter(services, optionalColor) {
        services.events.subscribe(Event.TICK_START, Stats.start);
        services.events.subscribe(Event.TICK_END, Stats.end);

        services.sceneStorage.msTotal = 0;
        services.sceneStorage.msCount = 0;
        services.sceneStorage.fpsTotal = 0;
        services.sceneStorage.fpsCount = 0;

        var ms = services.visuals.createText('0')
            .setPosition(Width.get(1920, 1880), Height.get(1080, 1020))
            .setSize(Font.get(50))
            .setZIndex(111);
        var fps = services.visuals.createText('0')
            .setPosition(Width.get(1920, 1880), Height.get(1080, 1040))
            .setSize(Font.get(50))
            .setZIndex(111);

        if (optionalColor) {
            ms.setColor(optionalColor);
            fps.setColor(optionalColor);
        }

        services.events.subscribe(Event.TICK_DRAW, function () {
            ms.data.msg = Stats.getMs()
                .toString() + ' ms';
            fps.data.msg = Stats.getFps()
                .toString() + ' fps';

            services.sceneStorage.msTotal += Stats.getMs();
            services.sceneStorage.msCount++;
            services.sceneStorage.fpsTotal += Stats.getFps();
            services.sceneStorage.fpsCount++;
        });
    }

    return setupFPSMeter;
})(H5.Event, H5.Stats, H5.Width, H5.Height, H5.Font);
