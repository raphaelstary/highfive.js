var PreGame = (function (Transition, Credits, window, calcScreenConst, GameStuffHelper, changeCoords, changePath, changeTouchable, Repository) {
    "use strict";

    function PreGame(stage, sceneStorage, tapController, fullScreen, messages, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
        this.fullScreen = fullScreen;
        this.messages = messages;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';
    var SHIELDS_DOWN = 'shields_down/shields_down';
    var SHIELDS_UP = 'shields_up/shields_up';
    var BUTTON_SEC = 'button_secondary';
    var BUTTON_SEC_ACTIVE = 'button_secondary_active';
    var BUTTON_PRIM = 'button_primary';
    var BUTTON_PRIM_ACTIVE = 'button_primary_active';

    var CLICK = 'click';

    var PRE_GAME_SCENE = 'pre_game_scene';
    var CREDITS_SCENE = 'credits_scene';

    var PRE_GAME_MSG_KEY = 'pre_game';
    var CREDITS_MSG = 'credits';
    var PLAY_MSG = 'play';

    var FONT = 'KenPixel';
    var FONT_COLOR = '#fff';
    var BLACK = '#000';

    PreGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var logoDrawable = this.sceneStorage.logo;
        delete this.sceneStorage.logo;

        this.resizeBus.add(PRE_GAME_SCENE, this.resize.bind(this));
        this.resizeRepo = new Repository();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.fadeOffSet = false;

        var self = this;

        function getFadeOffSet() {
            if (self.fadeOffSet)
                return - self.screenWidth;
            return 0;
        }

        function getWidthHalf() {
            return calcScreenConst(self.screenWidth, 2) + getFadeOffSet();
        }

        function getLogoX() {
            return getWidthHalf();
        }
        function getLogoY() {
            return calcScreenConst(self.screenHeight, 32, 7);
        }

        self.resizeRepo.add(logoDrawable, function () {
            changeCoords(logoDrawable, getLogoX(), getLogoY());
        });


        function getShipStartY() {
            return calcScreenConst(self.stage.getSubImage(SHIP).height, 2) + self.screenHeight;
        }
        function getShipX() {
            return getWidthHalf();
        }
        function getShipEndY() {
            return calcScreenConst(self.screenHeight, 2);
        }

        var shipStartY = getShipStartY();
        var shipEndY = getShipEndY();
        var shipX_widthHalf = getShipX();
        var shipDrawable = self.stage.drawFresh(shipX_widthHalf, shipStartY, SHIP);
        var shipInPath = self.stage.getPath(shipX_widthHalf, shipStartY, shipX_widthHalf, shipEndY, 60,
            Transition.EASE_IN_QUAD);

        var fireDrawable = self.stage.animateFresh(shipX_widthHalf, shipStartY, FIRE, 10);

        self.resizeRepo.add(shipDrawable, function () {
            var shipX = getShipX();
            changeCoords(shipDrawable, shipX, getShipStartY());
            changeCoords(fireDrawable, shipX, getShipStartY());
            changePath(shipInPath, shipX, getShipStartY(), shipX, getShipEndY());
        });


        function getPlayY() {
            return calcScreenConst(self.screenHeight, 4, 3);
        }

        var pressPlay = self.stage.getDrawable(shipX_widthHalf, getPlayY(), BUTTON_PRIM);

        var pressPlayTxt = self.stage.getDrawableText(shipX_widthHalf, getPlayY(), 3, self.messages.get(PRE_GAME_MSG_KEY, PLAY_MSG), 15,
            FONT, FONT_COLOR);
        var playTouchable = {id: 'ready_tap', x: pressPlay.getCornerX(), y: pressPlay.getCornerY(),
            width: pressPlay.getWidth(), height: pressPlay.getHeight()};
        self.resizeRepo.add(pressPlay, function () {
            changeCoords(pressPlay, getShipX(), getPlayY());
            changeCoords(pressPlayTxt, getShipX(), getPlayY());
            changeTouchable(playTouchable, pressPlay.getCornerX(), pressPlay.getCornerY(), pressPlay.getWidth(),
                pressPlay.getHeight());
        });


        var credits, lightFrame;
        var allTouchables = [
            {touchable: playTouchable, fn: startPlaying, anchor: pressPlay}
        ];

        function registerTapListener() {
            allTouchables.forEach(function (wrapper) {
                changeTouchable(wrapper.touchable, wrapper.anchor.getCornerX(), wrapper.anchor.getCornerY(),
                wrapper.anchor.getWidth(), wrapper.anchor.getHeight());

                self.tapController.add(wrapper.touchable, wrapper.fn);
            });
        }

        function unRegisterTapListener() {
            allTouchables.forEach(function (wrapper) {
                self.tapController.remove(wrapper.touchable);
            });
        }

        self.stage.move(shipDrawable, shipInPath, function () {
            self.resizeRepo.add(shipDrawable, function () {
                var shipX = getShipX();
                var shipY = getShipEndY();
                changeCoords(shipDrawable, shipX, shipY);
                changeCoords(fireDrawable, shipX, shipY);
            });

            shieldsAnimation();
            self.stage.draw(pressPlay);
            self.stage.draw(pressPlayTxt);

            function getBottomY() {
                return calcScreenConst(self.screenHeight, 50, 47);
            }

            var bottomRaster = getBottomY();

            function getButtonX() {
                return calcScreenConst(self.screenWidth, 4, 3) + getFadeOffSet();
            }

            var xButton = getButtonX();

            lightFrame = self.stage.drawFresh(xButton, bottomRaster, BUTTON_SEC);

            credits = self.stage.getDrawableText(xButton, bottomRaster, 3, self.messages.get(PRE_GAME_MSG_KEY, CREDITS_MSG), 15,
                FONT, FONT_COLOR, 0, 0.5);
            self.stage.draw(credits);

            var creditsTouchable = {id: 'credits_tap', x: lightFrame.getCornerX(), y: lightFrame.getCornerY(),
                width: lightFrame.getWidth(), height: lightFrame.getHeight()};

            self.resizeRepo.add(credits, function () {
                changeCoords(lightFrame, getButtonX(), getBottomY());
                changeCoords(credits, getButtonX(), getBottomY());
                changeTouchable(creditsTouchable, lightFrame.getCornerX(), lightFrame.getCornerY(),
                    lightFrame.getWidth(), lightFrame.getHeight());
            });

            allTouchables.push({touchable: creditsTouchable, fn: goToCreditsScreen, anchor: lightFrame});

            function goToCreditsScreen() {
                self.sounds.play(CLICK);
                credits.txt.alpha = 1;
                lightFrame.img = self.stage.getSubImage(BUTTON_SEC_ACTIVE);
                window.setTimeout(function () {
                    credits.txt.alpha = 0.5;
                    lightFrame.img = self.stage.getSubImage(BUTTON_SEC);
                }, 1500);
                var creditsScreen = new Credits(self.stage, self.tapController, self.messages, self.sounds);

                unRegisterTapListener();

                function continuePreGame() {
                    self.fadeOffSet = false;
                    registerTapListener();
                    doTheShields = true;
                    shieldsAnimation();

                    self.resizeBus.remove(CREDITS_SCENE);
                }

                function setFadeOffSet() {
                    self.fadeOffSet = true;
                }

                doTheShields = false;
                self.stage.remove(shieldsDrawable);
                self.resizeBus.add(CREDITS_SCENE, creditsScreen.resize.bind(creditsScreen));
                creditsScreen.show(continuePreGame,
                    [credits, lightFrame, pressPlay, pressPlayTxt, logoDrawable,
                        shipDrawable, fireDrawable], self.screenWidth, self.screenHeight, setFadeOffSet);
            }

            registerTapListener();

        });

        self.stage.move(fireDrawable, shipInPath, function () {
            fireDrawable.y = shipEndY;
        });

        function startPlaying() {
            self.sounds.play(CLICK);

            pressPlay.img = self.stage.getSubImage(BUTTON_PRIM_ACTIVE);
            pressPlayTxt.txt.color = BLACK;
            window.setTimeout(function () {
                self.fullScreen.request();
                endOfScreen();
            }, 300);
        }

        var shieldsDownSprite = self.stage.getSprite(SHIELDS_DOWN, 6, false);
        var shieldsUpSprite = self.stage.getSprite(SHIELDS_UP, 6, false);
        var shieldsDrawable = self.stage.getDrawable(shipX_widthHalf, shipEndY, SHIELDS);
        self.resizeRepo.add(shieldsDrawable, function () {
            changeCoords(shieldsDrawable, getShipX(), getShipEndY());
        });

        var startTimer = 10;
        var doTheShields = true;

        function shieldsAnimation() {

            self.stage.animateLater({item: shieldsDrawable, sprite: shieldsUpSprite, ready: function () {

                shieldsDrawable.img = self.stage.getSubImage(SHIELDS);
                self.stage.animateLater({item: shieldsDrawable, sprite: shieldsDownSprite, ready: function () {
                    self.stage.remove(shieldsDrawable);
                    startTimer = 20;
                    if (doTheShields) {
                        shieldsAnimation();
                    }
                }}, 48, checkIfShouldStopThisMadness);
            }}, startTimer, checkIfShouldStopThisMadness);

            function checkIfShouldStopThisMadness() {
                if (!doTheShields) {
                    self.stage.remove(shieldsDrawable);
                }
            }
        }

        // end of screen

        function endOfScreen() {
            [credits, lightFrame, pressPlay, pressPlayTxt].forEach(self.stage.remove.bind(self.stage));
            // end event
            unRegisterTapListener();

            var logoOut = self.stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x,
                    logoDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
            self.stage.move(logoDrawable, logoOut, function () {
                self.stage.remove(logoDrawable);
            });
            self.resizeRepo.add(logoDrawable, function () {
                changeCoords(logoDrawable, getLogoX(), getLogoY());
                changePath(logoOut, logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + self.screenHeight);
            });

            function getShipGamePositionY() {
                return calcScreenConst(self.screenHeight, 6, 5);
            }

            var dockShipToGamePosition = self.stage.getPath(shipDrawable.x, shipDrawable.y,
                shipDrawable.x, getShipGamePositionY(), 30, Transition.EASE_IN_OUT_EXPO);
            self.resizeRepo.add(shipDrawable, function () {
                changeCoords(shipDrawable, getShipX(), getShipEndY());
                changeCoords(fireDrawable, getShipX(), getShipEndY());
                changePath(dockShipToGamePosition, shipDrawable.x, shipDrawable.y, shipDrawable.x,
                    getShipGamePositionY());
            });


            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, dockShipToGamePosition, function () {
                self.resizeRepo.add(shipDrawable, function () {
                    changeCoords(shipDrawable, getShipX(), getShipGamePositionY());
                    changeCoords(fireDrawable, getShipX(), getShipGamePositionY());
                });

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

        delete this.resizeRepo;
        delete this.screenWidth;
        delete this.screenHeight;
        this.resizeBus.remove(PRE_GAME_SCENE);

        nextScene();
    };

    PreGame.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);
        this.resizeRepo.call();
    };

    return PreGame;
})(Transition, Credits, window, calcScreenConst, GameStuffHelper, changeCoords, changePath, changeTouchable, Repository);