var KillScreen = (function (Transition, calcScreenConst, changeCoords, changePath, heightHalf, GameStuffHelper) {
    "use strict";

    function KillScreen(stage, sceneStorage, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    KillScreen.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var speedStripes = this.sceneStorage.speedStripes;
        delete this.sceneStorage.speedStripes;
        var shipDrawable = this.sceneStorage.ship;
        var fireDrawable = this.sceneStorage.fire;
        var countDrawables = this.sceneStorage.counts;

        this.resizeBus.add('kill_screen_scene', this.resize.bind(this));

        var self = this;

        speedStripes.forEach(function (speedStripeWrapper) {
            self.stage.remove(speedStripeWrapper.drawable);
        });

        var heightHalf = calcScreenConst(screenHeight, 2);
        var dockShipToMiddlePosition = this.dockShipPath = self.stage.getPath(shipDrawable.x, shipDrawable.y,
            shipDrawable.x, heightHalf, 120, Transition.EASE_OUT_EXPO);

        var explosionSprite = self.stage.getSprite('final_explosion/final_explosion', 22, false);

        self.stage.move(shipDrawable, dockShipToMiddlePosition, function () {
            self.shipDocked = true;
            self.sounds.play('ship-explosion');
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
        delete this.sceneStorage.ship;
        delete this.sceneStorage.fire;
        delete this.sceneStorage.counts;

        delete this.dockShipPath;
        delete this.shipDocked;

        this.resizeBus.remove('kill_screen_scene');

        nextScene();
    };

    KillScreen.prototype.resize = function (width, height) {
        GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);

        var half = heightHalf(height);
        if (this.shipDocked) {
            this.sceneStorage.fire.y = half;
            this.sceneStorage.ship.y = half;
        } else {
            changePath(this.dockShipPath, this.sceneStorage.ship.x, this.sceneStorage.ship.y, this.sceneStorage.ship.x,
                half);
        }
    };

    return KillScreen;
})(Transition, calcScreenConst, changeCoords, changePath, heightHalf, GameStuffHelper);