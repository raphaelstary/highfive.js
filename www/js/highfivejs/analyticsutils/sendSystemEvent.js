H5.sendSystemEvent = (function (Event, location, appName, appVersion, geolocation, Promise, GamePad) {
    "use strict";

    function collectPositionInfo() {
        var promise = new Promise();

        geolocation.getCurrentPosition(function (position) {
            promise.resolve(position);
        }, function (error) {
            promise.resolve(error);
        }, {enableHighAccuracy: false});

        return promise;
    }

    function collectGamePadInfo() {
        var gamePad = new GamePad();
        var gamePads = gamePad.getGamePads();
        var padsInfo = [];
        var connectedGamePads = 0;
        for (var i = 0; i < gamePads.length; i++) {
            var currentPad = gamePads[i];
            if (currentPad) {
                connectedGamePads++;

                padsInfo.push({
                    id: gamePads[i].id,
                    index: gamePads[i].index,
                    mapping: gamePads[i].mapping,
                    profile: gamePads[i].profile
                });
            }
        }

        return {
            connectedGamePads: connectedGamePads,
            gamePadInfo: padsInfo
        }
    }

    function sendSystemEvent(device, messages, events) {

        collectPositionInfo().then(function (positionInfo) {

            //noinspection JSPotentiallyInvalidConstructorUsage
            var payload = {
                type: 'system',
                width: device.width,
                height: device.height,
                cssWidth: device.cssWidth,
                cssHeight: device.cssHeight,
                screenWidth: device.screenWidth,
                screenHeight: device.screenHeight,
                devicePixelRatio: device.devicePixelRatio,
                mobile: device.isMobile,
                userAgent: device.userAgent,
                language: messages.defaultLanguageCode,
                userTime: Date.now(),
                userTimeString: Date(),
                location: location.href,
                gamePadInfo: collectGamePadInfo(),
                positionInfo: positionInfo,
                app: appName,
                version: appVersion
            };

            events.fire(Event.ANALYTICS, payload);
        });
    }

    return sendSystemEvent;
})(H5.Event, window.location, window.appName, window.appVersion, window.navigator.geolocation, H5.Promise, H5.GamePad);