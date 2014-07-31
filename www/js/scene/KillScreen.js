var KillScreen = (function (Transition, calcScreenConst, changeCoords, changePath, FireHelper, ShipHelper, BackGroundHelper, CountHelper, heightHalf) {
    "use strict";

    function KillScreen(stage, sceneStorage, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.resizeBus = resizeBus;
    }

    KillScreen.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var speedStripes = this.sceneStorage.speedStripes;
        delete this.sceneStorage.speedStripes;
        var shipDrawable = this.shipDrawable = this.sceneStorage.ship;
        delete this.sceneStorage.ship;
        var fireDrawable = this.fireDrawable = this.sceneStorage.fire;
        delete this.sceneStorage.fire;
        var countDrawables = this.countDrawables = this.sceneStorage.counts;
        delete this.sceneStorage.counts;

        this.resizeBus.add('kill_screen_scene', this.resize.bind(this));

        var self = this;

        speedStripes.forEach(function (speedStripeWrapper) {
            self.stage.remove(speedStripeWrapper.drawable);
        });

        var heightHalf = calcScreenConst(screenHeight, 2);
        var dockShipToMiddlePosition = this.dockShipPath = self.stage.getPath(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, heightHalf, 120, Transition.EASE_OUT_EXPO);

        var explosionSprite = self.stage.getSprite('explosion-anim/explosion', 25, false);

        self.stage.move(shipDrawable, dockShipToMiddlePosition, function () {
            self.shipDocked = true;
            self.stage.animate(shipDrawable, explosionSprite, function () {
                self.stage.remove(shipDrawable);
                self.stage.remove(fireDrawable);

                countDrawables.forEach(function (count) {
                    self.stage.remove(count);
                });

                self.next(nextScene);
            });
        });
        self.stage.move(fireDrawable, dockShipToMiddlePosition);
    };

    KillScreen.prototype.next = function (nextScene) {
        delete this.shipDrawable;
        delete this.fireDrawable;
        delete this.countDrawables;
        delete this.dockShipPath;
        delete this.shipDocked;

        this.resizeBus.remove('kill_screen_scene');

        nextScene();
    };

    KillScreen.prototype.resize = function (width, height) {
        FireHelper.resize(this.fireDrawable, width, height);
        ShipHelper.resize(this.shipDrawable, width, height);
        BackGroundHelper.resize(this.sceneStorage.backGround, width, height);
        CountHelper.resize(this.countDrawables, this.stage, width, height);

        var half = heightHalf(height);
        if (this.shipDocked) {
            this.fireDrawable.y = half;
            this.shipDrawable.y = half;
        } else {
            changePath(this.dockShipPath, this.shipDrawable.x, this.shipDrawable.y, this.shipDrawable.x, half);
        }
    };

    return KillScreen;
})(Transition, calcScreenConst, changeCoords, changePath, FireHelper, ShipHelper, BackGroundHelper, CountHelper, heightHalf);