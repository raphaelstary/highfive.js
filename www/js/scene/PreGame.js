var PreGame = (function (Transition) {
    "use strict";

    function PreGame(stage, sceneStorage, tapController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
    }

    PreGame.prototype.show = function (nextScene) {
        var logoDrawable = this.sceneStorage.logo;
        delete this.sceneStorage.logo;

        var self = this;

        var shipStartY = 600;
        var shipEndY = 480 / 8 * 5;
        var shipDrawable = self.stage.drawFresh(320 / 2, shipStartY, 'ship');
        var shipInPath = self.stage.getPath(320 / 2, shipStartY, 320 / 2, shipEndY, 60, Transition.EASE_IN_QUAD);

        var fireDrawable = self.stage.animateFresh(320 / 2, shipStartY, 'fire-anim/fire', 8);
        var tapDrawable;
        var pressPlay = self.stage.getDrawable(320 / 2, 480 / 3, 'play');
        var touchable = {id: 'ready_tap', x: 0, y: 0, width: 320, height: 480};
        self.stage.move(shipDrawable, shipInPath, function () {
            shipDrawable.y = shipEndY;
            shieldsAnimation();
            tapDrawable = self.stage.animateFresh(320 / 16 * 9, 480 / 8 * 7, 'tap-anim/tap', 36);
            self.stage.draw(pressPlay);


            self.tapController.add(touchable, function () {
                var pressPlaySprite = self.stage.getSprite('press-play-anim/press_play', 16);
                self.stage.animate(pressPlay, pressPlaySprite, function () {
                    endOfScreen();
                });

            });

        });
        self.stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        var shieldsDownSprite = self.stage.getSprite('shields-down-anim/shields_down', 6, false);
        var shieldsUpSprite = self.stage.getSprite('shields-up-anim/shields_up', 6, false);
        var shieldsDrawable = self.stage.getDrawable(320 / 2, shipEndY, 'shields');

        //------------------------------- DEBUG_ONLY start
//        if (DEBUG_START_IMMEDIATELY) {
//            self.stage.remove(pressPlay);
//            self.tapController.remove(touchable);
//            self.stage.drawFresh(320 / 2, 480 / 2, 'background', 0);
//            var stripes = this._showSpeedStripes(stage, 0);
//            this._startingPositionScene(stage, shipDrawable, fireDrawable, shieldsDrawable,
//                shieldsUpSprite, shieldsDownSprite, stripes);
//
//            return;
//        }
        //------------------------------- DEBUG_ONLY end

        var startTimer = 10;
        var doTheShields = true;

        function shieldsAnimation() {

            self.stage.animateLater({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {
                shieldsDrawable.img = self.stage.getSubImage('shield3');
                self.stage.animateLater({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    self.stage.remove(shieldsDrawable);
                    startTimer = 20;
                    if (doTheShields) {
                        shieldsAnimation();
                    }
                }}, 28)
            }}, startTimer);
        }

        // end of screen

        function endOfScreen() {
            self.stage.remove(pressPlay);
            // end event
            self.tapController.remove(touchable);

            var logoOut = self.stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
            self.stage.move(logoDrawable, logoOut, function () {
                self.stage.remove(logoDrawable);
            });
            var tapOut = self.stage.getPath(tapDrawable.x, tapDrawable.y, tapDrawable.x, tapDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
            self.stage.move(tapDrawable, tapOut, function () {
                self.stage.remove(tapDrawable);
            });

            var dockShipToGamePosition = self.stage.getPath(shipDrawable.x, shipDrawable.y,
                shipDrawable.x, 400, 30, Transition.EASE_IN_OUT_EXPO);

            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, dockShipToGamePosition, function () {
                // next scene
                self.next(nextScene, shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite);
            });

            self.stage.move(fireDrawable, dockShipToGamePosition);

        }
    };

    PreGame.prototype.next = function (nextScene, shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite) {
        this.sceneStorage.ship = shipDrawable;
        this.sceneStorage.fire = fireDrawable;
        this.sceneStorage.shields = shieldsDrawable;
        this.sceneStorage.shieldsUp = shieldsUpSprite;
        this.sceneStorage.shieldsDown = shieldsDownSprite;

        nextScene();
    };

    return PreGame;
})(Transition);