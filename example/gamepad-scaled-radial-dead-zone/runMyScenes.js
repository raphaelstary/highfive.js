G.runMyScenes = (function (Event, Width, Height, Font, Math, Vectors) {
    'use strict';

    var deadZoneSquared = 0.2 * 0.2; // using squared for performance reasons

    function runMyScenes(services) {

        var force = services.device.height / 720 * 16; // not responsive here, if screen size changes

        setupGamePadDebugTxt(services, force);

        var cursor = services.stage.createCircle()
            .setPosition(Width.HALF, Height.HALF)
            .setColor('#039be5')
            .setLineWidth(Font.get(720, 4))
            .setRadius(Font.get(10));

        var direction = {
            x: 0,
            y: 0
        };

        services.events.subscribe(Event.GAME_PAD, function (gamePad) {
            direction.x = gamePad.getLeftStickXAxis();
            direction.y = gamePad.getLeftStickYAxis();

            var magnitudeSquared = Vectors.squaredMagnitude(direction.x, direction.y); // using squared for performance reasons
            if (magnitudeSquared < deadZoneSquared) {
                direction.x = 0;
                direction.y = 0;

            } else {
                var normalized = Vectors.normalizeWithMagnitude(direction.x, direction.y, magnitudeSquared);
                // using squared for performance reasons
                direction.x = normalized.x * ((magnitudeSquared - deadZoneSquared) / (1 - deadZoneSquared));
                direction.y = normalized.y * ((magnitudeSquared - deadZoneSquared) / (1 - deadZoneSquared));
            }
        });

        services.events.subscribe(Event.TICK_POST_INPUT, function () {
            cursor.x += Math.round(direction.x * force);
            cursor.y += Math.round(direction.y * force);
        });
    }

    function setupGamePadDebugTxt(services, force) {

        var xAxisTxt = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 940))
            .setSize(Font._60).setZIndex(11).setColor('black');
        var yAxisTxt = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 960))
            .setSize(Font._60).setZIndex(11).setColor('black');

        var xForceTxt = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 980))
            .setSize(Font._60).setZIndex(11).setColor('black');
        var yForceTxt = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 1000))
            .setSize(Font._60).setZIndex(11).setColor('black');

        var xForceScaled = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 1020))
            .setSize(Font._60).setZIndex(11).setColor('black');
        var yForceScaled = services.stage.createText('0').setPosition(Width.get(2), Height.get(1080, 1040))
            .setSize(Font._60).setZIndex(11).setColor('black');

        var xAxis = 0;
        var yAxis = 0;
        var xAxisScaled = 0;
        var yAxisScaled = 0;

        services.events.subscribe(Event.GAME_PAD, function (gamePad) {
            xAxis = gamePad.getLeftStickXAxis();
            yAxis = gamePad.getLeftStickYAxis();

            xAxisScaled = gamePad.getLeftStickXAxis();
            yAxisScaled = gamePad.getLeftStickYAxis();

            var magnitudeSquared = Vectors.squaredMagnitude(xAxis, yAxis); // using squared for performance reasons
            if (magnitudeSquared < deadZoneSquared) {
                xAxis = 0;
                yAxis = 0;

                xAxisScaled = 0;
                yAxisScaled = 0;

            } else {
                var normalized = Vectors.normalizeWithMagnitude(xAxisScaled, yAxisScaled, magnitudeSquared);
                // using squared for performance reasons
                xAxisScaled = normalized.x * ((magnitudeSquared - deadZoneSquared) / (1 - deadZoneSquared));
                yAxisScaled = normalized.y * ((magnitudeSquared - deadZoneSquared) / (1 - deadZoneSquared));
            }
        });

        services.events.subscribe(Event.TICK_POST_INPUT, function () {
            xAxisTxt.data.msg = 'xAxis: ' + xAxis;
            yAxisTxt.data.msg = 'yAxis: ' + yAxis;

            xForceTxt.data.msg = 'xForce: ' + Math.round(xAxis * force);
            yForceTxt.data.msg = 'yForce: ' + Math.round(yAxis * force);

            xForceScaled.data.msg = 'xForceScaled: ' + Math.round(xAxisScaled * force);
            yForceScaled.data.msg = 'yForceScaled: ' + Math.round(yAxisScaled * force);
        });
    }

    return runMyScenes;
})(H5.Event, H5.Width, H5.Height, H5.Font, Math, H5.Vectors);
