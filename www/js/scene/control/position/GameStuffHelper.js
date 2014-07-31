var GameStuffHelper = (function (FireHelper, ShipHelper, BackGroundHelper, SpeedStripesHelper, CountHelper) {
    "use strict";

    function drawSharedGameStuff(stage, sceneStorage, screenWidth, screenHeight) {
        if (!sceneStorage.speedStripes) {
            sceneStorage.speedStripes = SpeedStripesHelper.draw(stage, 0, screenWidth, screenHeight);
        }
        if (!sceneStorage.ship) {
            sceneStorage.ship = ShipHelper.draw(stage, screenWidth, screenHeight);
        }
        if (!sceneStorage.fire) {
            sceneStorage.fire = FireHelper.draw(stage, screenWidth, screenHeight);
        }
        if (!sceneStorage.backGround) {
            sceneStorage.backGround = BackGroundHelper.draw(stage, screenWidth, screenHeight);
        }
    }

    function resizeSharedGameStuff(stage, sceneStorage, width, height) {
        if (sceneStorage.fire)
            FireHelper.resize(sceneStorage.fire, width, height);
        if (sceneStorage.ship)
            ShipHelper.resize(sceneStorage.ship, width, height);
        if (sceneStorage.backGround)
            BackGroundHelper.resize(sceneStorage.backGround, width, height);
        if (sceneStorage.speedStripes)
            SpeedStripesHelper.resize(sceneStorage.speedStripes, stage, width, height);
        if (sceneStorage.counts)
            CountHelper.resize(sceneStorage.counts, stage, width, height);
    }

    return {
        resize: resizeSharedGameStuff,
        draw: drawSharedGameStuff
    };
})(FireHelper, ShipHelper, BackGroundHelper, SpeedStripesHelper, CountHelper);