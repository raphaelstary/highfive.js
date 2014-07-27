var PreGame = (function (Transition, Credits, window, calcScreenConst) {
    "use strict";

    function PreGame(stage, sceneStorage, tapController, fullScreen, messages) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
        this.fullScreen = fullScreen;
        this.messages = messages;
    }

    PreGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var logoDrawable = this.sceneStorage.logo;
        delete this.sceneStorage.logo;

        var self = this;

        var shipStartY = calcScreenConst(self.stage.getSubImage('ship').height, 2) + screenHeight;
        var shipEndY = calcScreenConst(screenHeight, 2);
        var shipDrawable = self.stage.drawFresh(calcScreenConst(screenWidth, 2), shipStartY, 'ship');
        var screenHalf = calcScreenConst(screenWidth, 2);
        var shipInPath = self.stage.getPath(screenHalf, shipStartY, screenHalf, shipEndY, 60,
            Transition.EASE_IN_QUAD);

        var fireDrawable = self.stage.animateFresh(screenHalf, shipStartY, 'fire-anim/fire', 8);
        var pressPlay = self.stage.getDrawable(screenHalf, calcScreenConst(screenHeight, 4, 3), 'play');
        var playTouchable = {id: 'ready_tap', x: pressPlay.getCornerX(), y: pressPlay.getCornerY(),
            width: pressPlay.getWidth(), height: pressPlay.getHeight()};

        var shareFb, shareTw, credits, settings, lightFrame;
        var allTouchables = [
            {touchable: playTouchable, fn: startPlaying}
        ];

        function registerTapListener() {
            allTouchables.forEach(function (wrapper) {
                self.tapController.add(wrapper.touchable, wrapper.fn);
            });
        }

        function unRegisterTapListener() {
            allTouchables.forEach(function (wrapper) {
                self.tapController.remove(wrapper.touchable);
            });
        }

        self.stage.move(shipDrawable, shipInPath, function () {
            shipDrawable.y = shipEndY;
            shieldsAnimation();
            self.stage.draw(pressPlay);
            var topRaster = calcScreenConst(screenHeight, 25, 2);
            var settingsWidthHalf = calcScreenConst(self.stage.getSubImage('settings').width, 2);
            settings = self.stage.drawFresh(settingsWidthHalf, topRaster, 'settings');
            var fivePerCent = calcScreenConst(screenWidth, 20);
            var imgHalf = calcScreenConst(self.stage.getSubImage('share-fb').width, 2);
            var padding = calcScreenConst(self.stage.getSubImage('share-fb').width, 4, 5);
            shareFb = self.stage.drawFresh(screenWidth - fivePerCent - imgHalf - padding, topRaster, 'share-fb');
            shareTw = self.stage.drawFresh(screenWidth - fivePerCent - imgHalf, topRaster, 'share-twitter');
            var bottomRaster = calcScreenConst(screenHeight, 50, 47);
            var xButton = calcScreenConst(screenWidth, 4, 3);
            lightFrame = self.stage.drawFresh(xButton, bottomRaster, 'light-button-frame');
            credits = self.stage.getDrawableText(xButton, bottomRaster, 3, self.messages.get('pre_game', 'credits'), 15,
                'KenPixel', '#fff', 0, 0.5);
            self.stage.draw(credits);

            var creditsTouchable = {id: 'credits_tap', x: lightFrame.getCornerX(), y: lightFrame.getCornerY(),
                width: lightFrame.getWidth(), height: lightFrame.getHeight()};

            allTouchables.push({touchable: creditsTouchable, fn: goToCreditsScreen});

            function goToCreditsScreen() {
                credits.txt.alpha = 1;
                window.setTimeout(function () {
                    credits.txt.alpha = 0.5;
                }, 1500);
                var creditsScreen = new Credits(self.stage, self.tapController, self.messages);

                unRegisterTapListener();

                function continuePreGame() {
                    registerTapListener();
                    doTheShields = true;
                    shieldsAnimation();
                }

                doTheShields = false;
                creditsScreen.show(continuePreGame,
                    [shareFb, shareTw, credits, settings, lightFrame, pressPlay, logoDrawable,
                        shipDrawable, fireDrawable], screenWidth, screenHeight);
            }

            registerTapListener();

        });

        self.stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        function startPlaying() {
            pressPlay.img = self.stage.getSubImage('play-active');

            window.setTimeout(function () {
                self.fullScreen.request();
                endOfScreen();
            }, 300);
        }

        var shieldsDownSprite = self.stage.getSprite('shields-down-anim/shields_down', 6, false);
        var shieldsUpSprite = self.stage.getSprite('shields-up-anim/shields_up', 6, false);
        var shieldsDrawable = self.stage.getDrawable(screenHalf, shipEndY, 'shields');

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
            unRegisterTapListener();

            var logoOut = self.stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x,
                    logoDrawable.y + screenHeight, 30, Transition.EASE_IN_EXPO);
            self.stage.move(logoDrawable, logoOut, function () {
                self.stage.remove(logoDrawable);
            });

            var dockShipToGamePosition = self.stage.getPath(shipDrawable.x, shipDrawable.y,
                shipDrawable.x, calcScreenConst(screenHeight, 6, 5), 30, Transition.EASE_IN_OUT_EXPO);

            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, dockShipToGamePosition, function () {
                // next scene
                self.next(nextScene, shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite, shieldsDownSprite);
            });

            self.stage.move(fireDrawable, dockShipToGamePosition);

        }
    };

    PreGame.prototype.next = function (nextScene, shipDrawable, fireDrawable, shieldsDrawable, shieldsUpSprite,
                                       shieldsDownSprite) {
        this.sceneStorage.ship = shipDrawable;
        this.sceneStorage.fire = fireDrawable;
        this.sceneStorage.shields = shieldsDrawable;
        this.sceneStorage.shieldsUp = shieldsUpSprite;
        this.sceneStorage.shieldsDown = shieldsDownSprite;

        nextScene();
    };

    return PreGame;
})(Transition, Credits, window, calcScreenConst);