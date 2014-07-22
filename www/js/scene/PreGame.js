var PreGame = (function (Transition, Credits, window) {
    "use strict";

    function PreGame(stage, sceneStorage, tapController, fullScreen, messages) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
        this.fullScreen = fullScreen;
        this.messages = messages;
    }

    PreGame.prototype.show = function (nextScene) {
        var logoDrawable = this.sceneStorage.logo;
        delete this.sceneStorage.logo;

        var self = this;

        var shipStartY = 600;
        var shipEndY = 480 / 2;
        var shipDrawable = self.stage.drawFresh(320 / 2, shipStartY, 'ship');
        var shipInPath = self.stage.getPath(320 / 2, shipStartY, 320 / 2, shipEndY, 60, Transition.EASE_IN_QUAD);

        var fireDrawable = self.stage.animateFresh(320 / 2, shipStartY, 'fire-anim/fire', 8);
        var pressPlay = self.stage.getDrawable(320 / 2, 480 / 4 * 3, 'play');
        var touchable = {id: 'ready_tap', x: pressPlay.getCornerX() - 30, y: pressPlay.getCornerY() - 30,
            width: pressPlay.getWidth() + 60, height: pressPlay.getHeight() + 60};

        var shareFb, shareTw, credits, settings, lightFrame;

        self.stage.move(shipDrawable, shipInPath, function () {
            shipDrawable.y = shipEndY;
            shieldsAnimation();
            self.stage.draw(pressPlay);
            var topRaster = 480 / 100 * 8;
            settings = self.stage.drawFresh(21, topRaster, 'settings');
            var fivePerCent = 320 / 100 * 5;
            var imgHalf = 36 / 2;
            var padding = 43;
            shareFb = self.stage.drawFresh(320 - fivePerCent - imgHalf - padding, topRaster, 'share-fb');
            shareTw = self.stage.drawFresh(320 - fivePerCent - imgHalf, topRaster, 'share-twitter');
            var bottomRaster = 480 / 100 * 94;
            lightFrame = self.stage.drawFresh(320 / 4 * 3, bottomRaster, 'light-button-frame');
            credits = self.stage.getDrawableText(320 / 4 * 3, bottomRaster, 3,
                self.messages.get('pre_game', 'credits'), 15, 'KenPixel', '#fff', 0, 0.5);
            self.stage.draw(credits);

            var creditsTouchable = {id: 'credits_tap', x: lightFrame.getCornerX(), y: lightFrame.getCornerY(),
                width: lightFrame.getWidth(), height: lightFrame.getHeight()};

            function goToCreditsScreen() {
                var creditsScreen = new Credits(self.stage, self.tapController, self.messages);
                var allTouchables = [
                    {touchable: touchable, fn: startPlaying},
                    {touchable: creditsTouchable, fn: goToCreditsScreen}
                ];
                allTouchables.forEach(function (wrapper) {
                    self.tapController.remove(wrapper.touchable);
                });
                function continuePreGame() {
                    allTouchables.forEach(function (wrapper) {
                        self.tapController.add(wrapper.touchable, wrapper.fn);
                    });
                    doTheShields = true;
                    shieldsAnimation();
                }

                doTheShields = false;
                creditsScreen.show(continuePreGame,
                    [shareFb, shareTw, credits, settings, lightFrame, pressPlay, logoDrawable,
                        shipDrawable, fireDrawable]);
            }

            self.tapController.add(creditsTouchable, goToCreditsScreen);

            function startPlaying() {
                pressPlay.img = self.stage.getSubImage('play-active');

                window.setTimeout(function () {
                    self.fullScreen.request();
                    endOfScreen();
                }, 300);
            }

            self.tapController.add(touchable, startPlaying);

        });
        self.stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        var shieldsDownSprite = self.stage.getSprite('shields-down-anim/shields_down', 6, false);
        var shieldsUpSprite = self.stage.getSprite('shields-up-anim/shields_up', 6, false);
        var shieldsDrawable = self.stage.getDrawable(320 / 2, shipEndY, 'shields');

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
                }}, 48);
            }}, startTimer);
        }

        // end of screen

        function endOfScreen() {
            [shareFb, shareTw, credits, settings, lightFrame, pressPlay].forEach(self.stage.remove.bind(self.stage));
            // end event
            self.tapController.remove(touchable);

            var logoOut = self.stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
            self.stage.move(logoDrawable, logoOut, function () {
                self.stage.remove(logoDrawable);
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
})(Transition, Credits, window);