var Credits = (function (Transition, window, calcScreenConst, changeCoords, changePath, changeTouchable, Repository) {
    "use strict";

    function Credits(stage, tapController, messages) {
        this.stage = stage;
        this.tapController = tapController;
        this.messages = messages;
    }

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

        var back, fb, twitter, letsplayIO;

        function drawCreditsScreen() {
            back = self.stage.drawFresh(calcScreenConst(self.screenWidth, 10) + self.screenWidth, calcScreenConst(self.screenHeight, 25, 2), 'back');
            self.resizeRepoDrawables.add(back, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(back, calcScreenConst(self.screenWidth, 10),
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeTouchable(backTouchable, back.getCornerX(), back.getCornerY(), back.getWidth(), back.getHeight());
                } else {
                    changeCoords(back, calcScreenConst(self.screenWidth, 10) + self.screenWidth,
                        calcScreenConst(self.screenHeight, 25, 2));
                    changeTouchable(backTouchable, back.getCornerX() - self.screenWidth, back.getCornerY(), back.getWidth(), back.getHeight());
                }
            });

            var KEN_PIXEL_BLOCKS = 'KenPixelBlocks';
            var LIGHT_GREY = '#c4c4c4';

            var game_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4), 3,
                self.messages.get('credits', 'game'), 45, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(game_txt);
            self.resizeRepoDrawables.add(game_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(game_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4));
                } else {
                    changeCoords(game_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4));
                }
            });

            var a_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) - game_txt.txt.size, 3,
                self.messages.get('credits', 'a'), 25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(a_txt);
            self.resizeRepoDrawables.add(a_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(a_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) - game_txt.txt.size);
                } else {
                    changeCoords(a_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) - game_txt.txt.size);
                }
            });

            var by_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) + game_txt.txt.size,
                3, self.messages.get('credits', 'by'), 25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(by_txt);
            self.resizeRepoDrawables.add(by_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(by_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) + game_txt.txt.size)
                } else {
                    changeCoords(by_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) + game_txt.txt.size)
                }
            });

            letsplayIO = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 2), 'credits-logo');
            self.resizeRepoDrawables.add(letsplayIO, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(letsplayIO, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 2));
                } else {
                    changeCoords(letsplayIO, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 2));
                }
            });

            fb = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4) + self.screenWidth,
                    calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3), 'credits-facebook');
            self.resizeRepoDrawables.add(fb, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(fb, calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4),
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3));
                } else {
                    changeCoords(fb, calcScreenConst(self.screenWidth, 2) - calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4) + self.screenWidth,
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3))
                }
            });

            twitter = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4) + self.screenWidth,
                    calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3), 'credits-twitter');
            self.resizeRepoDrawables.add(twitter, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(twitter, calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4),
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3));
                } else {
                    changeCoords(twitter, calcScreenConst(self.screenWidth, 2) + calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4) + self.screenWidth,
                            calcScreenConst(self.screenHeight, 2) + calcScreenConst(letsplayIO.img.height, 2, 3))
                }
            });

            var graphics_txt = self.stage.getDrawableText(calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) * 3, 3,
                self.messages.get('credits', 'graphics'), 20, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(graphics_txt);
            self.resizeRepoDrawables.add(graphics_txt, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2), calcScreenConst(self.screenHeight, 4) * 3);
                } else {
                    changeCoords(graphics_txt, calcScreenConst(self.screenWidth, 2) + self.screenWidth, calcScreenConst(self.screenHeight, 4) * 3);
                }
            });

            var kenney = self.stage.drawFresh(calcScreenConst(self.screenWidth, 2) + self.screenWidth, graphics_txt.y + calcScreenConst(self.stage.getSubImage('kenney').height, 6, 5),
                'kenney');
            self.resizeRepoDrawables.add(kenney, function () {
                if (self.drawablesAtNewPosition) {
                    changeCoords(kenney, calcScreenConst(self.screenWidth, 2), graphics_txt.y + calcScreenConst(self.stage.getSubImage('kenney').height));
                } else {
                    changeCoords(kenney, calcScreenConst(self.screenWidth, 2) + self.screenWidth, graphics_txt.y + calcScreenConst(self.stage.getSubImage('kenney').height));
                }
            });

            return [back, a_txt, game_txt, by_txt, letsplayIO, fb, twitter, graphics_txt, kenney];
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
                window.open('https://twitter.com/letsplayIO', '_blank');
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
                window.open('https://www.facebook.com/letsplayIO', '_blank');
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
                window.open('http://letsplay.io/', '_blank');
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
            back.img = self.stage.getSubImage('back-active');
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