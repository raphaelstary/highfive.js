var KillScreen = (function (Transition) {
    "use strict";

    function KillScreen(stage, sceneStorage) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
    }

    KillScreen.prototype.show = function (nextScene) {
        var speedStripes = this.sceneStorage.speedStripes;
        delete this.sceneStorage.speedStripes;
        var shipDrawable = this.sceneStorage.ship;
        delete this.sceneStorage.ship;
        var fireDrawable = this.sceneStorage.fire;
        delete this.sceneStorage.fire;
        var countDrawables = this.sceneStorage.counts;
        delete this.sceneStorage.counts;


        var self = this;

        speedStripes.forEach(function (speedStripe) {
            self.stage.remove(speedStripe);
        });

        var dockShipToMiddlePosition = self.stage.getPath(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, 480 / 2, 120, Transition.EASE_OUT_EXPO);

        var explosionSprite = self.stage.getSprite('explosion-anim/explosion', 25, false);

        self.stage.move(shipDrawable, dockShipToMiddlePosition, function () {
            self.stage.animate(shipDrawable, explosionSprite, function () {
                self.stage.remove(shipDrawable);
                self.stage.remove(fireDrawable);

                countDrawables.forEach(function (count) {
                    self.stage.remove(count);
                });

                nextScene()
            });
        });
        self.stage.move(fireDrawable, dockShipToMiddlePosition);
    };

    return KillScreen;
})(Transition);