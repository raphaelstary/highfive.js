var Credits = (function (Transition, window, calcScreenConst, changeCoords, changePath, changeTouchable, Repository) {
    "use strict";

    function Credits(stage, tapController, messages, sounds) {
        this.stage = stage;
        this.tapController = tapController;
        this.messages = messages;
        this.sounds = sounds;
    }

    var CLICK = 'click';
    var BUTTON_SEC_ACTIVE = 'button_secondary_active';
    var BUTTON_SEC = 'button_secondary';

    var CREDITS_MSG_KEY = 'credits';
    var GAME_MSG = 'game';
    var A_MSG = 'a';
    var BACK_MSG = 'back';
    var BY_MSG = 'by';
    var LOGO_SMALL = 'letsplayIO_logo_small';
    var FACEBOOK = 'facebook';
    var TWITTER = 'twitter';
    var GRAPHICS_MSG = 'graphics';
    var KENNEY_MSG = 'kenney';

    var FONT_SPECIAL = 'KenPixelBlocks';
    var LIGHT_GREY = '#c4c4c4';
    var FONT = 'KenPixel';
    var FONT_COLOR = '#fff';

    var TWITTER_URL = 'https://twitter.com/RaphaelStary';
    var FACEBOOK_URL = 'https://facebook.com/RaphaelStary';
    var SITE_URL = 'http://raphaelstary.com';

    var _BLANK = '_blank';

    Credits.prototype.resize = function (width, heigth) {
        this.screenWidth = width;
        this.screenHeight = heigth;

        if (this.resizeRepoDrawables)
            this.resizeRepoDrawables.call();
        if (this.resizeRepoTouchables)
            this.resizeRepoTouchables.call();
        if (this.resizeRepoPaths)
            this.resizeRepoPaths.call();
    };

    Credits.prototype.show = function (nextScene, previousScenesDrawables, screenWidth, screenHeight, setFadeOffSet) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.resizeRepoDrawables = new Repository();
        this.resizeRepoTouchables = new Repository();
        this.resizeRepoPaths = new Repository();

        var self = this;

        function fadeOut(drawables, callback) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x - self.screenWidth, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.resizeRepoTouchables.add(drawable, function () {
                    changePath(path, drawable.x, drawable.y, drawable.x - self.screenWidth, drawable.y);
                });
                self.stage.move(drawable, path, function () {
                    self.resizeRepoTouchables.remove(drawable);
                    if (callback)
                        callback();
                });
            });
        }

        function fadeIn(drawables, callback) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x + self.screenWidth, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.resizeRepoTouchables.add(drawable, function () {
                    changePath(path, drawable.x, drawable.y, drawable.x + self.screenWidth, drawable.y);
                });
                self.stage.move(drawable, path, function () {
                    self.resizeRepoTouchables.remove(drawable);
                    if (callback)
                        callback();
                });
            });
        }

        var back, backTxt, fb, twitter, letsplayIO;

        function drawCreditsScreen() {
            back = self.stage.drawFresh(calcScreenConst(self.screenWidth, 10) + self.screenWidth, calcScreenConst(self.screenHeight, 25, 2), BUTTON_SEC);
            backTxt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 10) + self.screenWidth, calcScreenConst(self.screenHeight, 25, 2),
                3, self.messages.get(CREDITS_MSG_KEY, BACK_MSG), 15, FONT, FONT_COLOR, 0, 0.5);
            self.stage.draw(backTxt);
            self.resizeRepoDrawables.add(back, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(back, calcScreenConst(self.screenWidth, 10),
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeCoords(backTxt, calcScreenConst(self.screenWidth, 10),
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeTouchable(backTouchable, back.getCornerX(), back.getCornerY(), back.getWidth(), back.getHeight());
                } else {
                    changeCoords(back, calcScreenConst(self.screenWidth, 10) + self.screenWidth,
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeCoords(backTxt, calcScreenConst(self.screenWidth, 10) + self.screenWidth,
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeTouchable(backTouchable, back.getCornerX() - self.screenWidth, back.getCornerY(), back.getWidth(), back.getHeight());
                }
            });

            var game_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4), 3,
                self.messages.get(CREDITS_MSG_KEY, GAME_MSG), 45, FONT_SPECIAL, LIGHT_GREY);
            self.stage.draw(game_txt);
            self.resizeRepoDrawables.add(game_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(game_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4));
                } else {
                    changeCoords(game_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4));
                }
            });

            var a_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) - game_txt.txt.size, 3,
                self.messages.get(CREDITS_MSG_KEY, A_MSG), 25, FONT_SPECIAL, LIGHT_GREY);
            self.stage.draw(a_txt);
            self.resizeRepoDrawables.add(a_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(a_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) - game_txt.txt.size);
                } else {
                    changeCoords(a_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) - game_txt.txt.size);
                }
            });

            var by_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) + game_txt.txt.size,
                3, self.messages.get(CREDITS_MSG_KEY, BY_MSG), 25, FONT_SPECIAL, LIGHT_GREY);
            self.stage.draw(by_txt);
            self.resizeRepoDrawables.add(by_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(by_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) + game_txt.txt.size)
                } else {
                    changeCoords(by_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) + game_txt.txt.size)
                }
            });


            letsplayIO = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 2), LOGO_SMALL);
            self.resizeRepoDrawables.add(letsplayIO, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(letsplayIO, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 2));
                } else {
                    changeCoords(letsplayIO, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 2));
                }
            });

            fb = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4) + self.screenWidth,
                    calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3), FACEBOOK);
            self.resizeRepoDrawables.add(fb, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(fb, calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4),
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3));
                } else {
                    changeCoords(fb, calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4) + self.screenWidth,
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3))
                }
            });


            twitter = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4) + self.screenWidth,
                    calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3), TWITTER);
            self.resizeRepoDrawables.add(twitter, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(twitter, calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4),
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3));
                } else {
                    changeCoords(twitter, calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage(FACEBOOK).width, 5, 4) + self.screenWidth,
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3))
                }
            });

            var graphics_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) * 3, 3,
                self.messages.get(CREDITS_MSG_KEY, GRAPHICS_MSG), 20, FONT_SPECIAL, LIGHT_GREY);
            self.stage.draw(graphics_txt);
            self.resizeRepoDrawables.add(graphics_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) * 3);
                } else {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) * 3);
                }
            });

            var kenney = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 6) * 5, 3,
                self.messages.get(CREDITS_MSG_KEY, KENNEY_MSG), 20, FONT_SPECIAL, LIGHT_GREY);
            self.stage.draw(kenney);
            self.resizeRepoDrawables.add(kenney, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 6) * 5);
                } else {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 6) * 5);
                }
            });

            return [back, backTxt, a_txt, game_txt, by_txt, letsplayIO, fb, twitter, graphics_txt, kenney];
        }

        function registerTapListener() {
            var twitterTouchable = {
                id: 'twitter_letsplayIO_tap',
                x: twitter.getCornerX() - self.screenWidth,
                y: twitter.getCornerY(),
                width: twitter.getWidth(),
                height: twitter.getHeight()
            };
            self.resizeRepoTouchables.add(twitterTouchable, function () {
                if (self.drawablesAtNewPosition) {
                    twitterTouchable.x = twitter.getCornerX();
                } else {
                    twitterTouchable.x = twitter.getCornerX() - self.screenWidth;
                }
                twitterTouchable.y = twitter.getCornerY();
                twitterTouchable.width = twitter.getWidth();
                twitterTouchable.height = twitter.getHeight();
            });
            self.tapController.add(twitterTouchable, function () {
                self.sounds.play(CLICK);
                window.open(TWITTER_URL, _BLANK);
            });

            var fbTouchable = {
                id: 'fb_letsplayIO_tap',
                x: fb.getCornerX() - self.screenWidth,
                y: fb.getCornerY(),
                width: fb.getWidth(),
                height: fb.getHeight()
            };
            self.resizeRepoTouchables.add(fbTouchable, function () {
                if (self.drawablesAtNewPosition) {
                    fbTouchable.x = fb.getCornerX();
                } else {
                    fbTouchable.x = fb.getCornerX() - self.screenWidth;
                }
                fbTouchable.y = fb.getCornerY();
                fbTouchable.width = fb.getWidth();
                fbTouchable.height = fb.getHeight();
            });
            self.tapController.add(fbTouchable, function () {
                self.sounds.play(CLICK);
                window.open(FACEBOOK_URL, _BLANK);
            });

            var letsplayIOSiteTouchable = {
                id: 'letsplayIO_site_tap',
                x: letsplayIO.getCornerX() - self.screenWidth,
                y: letsplayIO.getCornerY(),
                width: letsplayIO.getWidth(),
                height: letsplayIO.getHeight()
            };
            self.resizeRepoTouchables.add(letsplayIOSiteTouchable, function () {
                if (self.drawablesAtNewPosition) {
                    letsplayIOSiteTouchable.x = letsplayIO.getCornerX();
                } else {
                    letsplayIOSiteTouchable.x = letsplayIO.getCornerX() - self.screenWidth;
                }
                letsplayIOSiteTouchable.y = letsplayIO.getCornerY();
                letsplayIOSiteTouchable.width = letsplayIO.getWidth();
                letsplayIOSiteTouchable.height = letsplayIO.getHeight();
            });
            self.tapController.add(letsplayIOSiteTouchable, function () {
                self.sounds.play(CLICK);
                window.open(SITE_URL, _BLANK);
            });
            return [twitterTouchable, fbTouchable, letsplayIOSiteTouchable];
        }

        function unRegisterTapListener(touchables) {
            touchables.forEach(self.tapController.remove.bind(self.tapController));
        }

        fadeOut(previousScenesDrawables, function () {
            setFadeOffSet();
        });
        var creditsDrawables = drawCreditsScreen();
        var touchables = registerTapListener();
        self.drawablesAtNewPosition = false;
        fadeOut(creditsDrawables, function () {
            self.drawablesAtNewPosition = true;
        });


        var backTouchable = {
            id: 'back_tap',
            x: back.getCornerX(),
            y: back.getCornerY(),
            width: back.getWidth(),
            height: back.getHeight()
        };
        self.tapController.add(backTouchable, endScene);
        touchables.push(backTouchable);

        function endScene() {
            self.sounds.play(CLICK);
            back.img = self.stage.getSubImage(BUTTON_SEC_ACTIVE);
            backTxt.alpha = 1;
            unRegisterTapListener(touchables);
            fadeIn(creditsDrawables);
            function removeDrawables() {
                creditsDrawables.forEach(self.stage.remove.bind(self.stage));
            }

            var numberOfCallbacksLeft = previousScenesDrawables.length;
            fadeIn(previousScenesDrawables, function () {
                if (--numberOfCallbacksLeft > 0)
                    return;
                removeDrawables();
                self.next(nextScene);
            });
        }

    };

    Credits.prototype.next = function (nextScene) {
        delete this.resizeRepoDrawables;
        delete this.resizeRepoTouchables;
        delete this.resizeRepoPaths;

        nextScene();
    };

    return Credits;
})(Transition, window, calcScreenConst, changeCoords, changePath, changeTouchable, Repository);