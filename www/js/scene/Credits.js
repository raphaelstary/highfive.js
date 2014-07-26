var Credits = (function (Transition, window, calcScreenConst) {
    "use strict";

    function Credits(stage, tapController, messages) {
        this.stage = stage;
        this.tapController = tapController;
        this.messages = messages;
    }

    Credits.prototype.show = function (nextScene, previousScenesDrawables, screenWidth, screenHeight) {
        var self = this;

        function fadeOut(drawables) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x - screenWidth, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.stage.move(drawable, path);
            });
        }

        function fadeIn(drawables) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x + screenWidth, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.stage.move(drawable, path);
            });
        }
        var back;
        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);
        var screenHeightQuarter = calcScreenConst(screenHeight, 4);
        var offSet = screenWidth;

        var fb, twitter, letsplayIO;
        function drawCreditsScreen() {
            var topRaster = calcScreenConst(screenHeight, 25, 2);
            back = self.stage.drawFresh(calcScreenConst(screenWidth, 10) + offSet, topRaster, 'back');

            var KEN_PIXEL_BLOCKS = 'KenPixelBlocks';
            var LIGHT_GREY = '#c4c4c4';

            var game_txt = self.stage.getDrawableText(screenWidthHalf + offSet, screenHeightQuarter, 3,
                self.messages.get('credits', 'game'), 45, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(game_txt);

            var a_txt = self.stage.getDrawableText(screenWidthHalf + offSet, screenHeightQuarter - game_txt.txt.size, 3,
                self.messages.get('credits', 'a'), 25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(a_txt);

            var by_txt = self.stage.getDrawableText(screenWidthHalf + offSet, screenHeightQuarter + game_txt.txt.size,
                3, self.messages.get('credits', 'by'), 25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(by_txt);

            letsplayIO = self.stage.drawFresh(screenWidthHalf + offSet, screenHeightHalf, 'credits-logo');
            var socialBtnOffSet = calcScreenConst(self.stage.getSubImage('credits-facebook').width, 5, 4);
            var logoMarginBottom = calcScreenConst(letsplayIO.img.height, 2, 3);
            fb = self.stage.drawFresh(screenWidthHalf - socialBtnOffSet + offSet,
                screenHeightHalf + logoMarginBottom, 'credits-facebook');
            twitter = self.stage.drawFresh(screenWidthHalf + socialBtnOffSet + offSet,
                screenHeightHalf + logoMarginBottom, 'credits-twitter');

            var graphics_txt = self.stage.getDrawableText(screenWidthHalf + offSet, screenHeightQuarter * 3, 3,
                self.messages.get('credits', 'graphics'), 20, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(graphics_txt);
            var gfxMarginBottom = calcScreenConst(self.stage.getSubImage('kenney').height, 6, 5);
            var kenney = self.stage.drawFresh(screenWidthHalf + offSet, graphics_txt.y + gfxMarginBottom,
                'kenney');

            return [back, a_txt, game_txt, by_txt, letsplayIO, fb, twitter, graphics_txt, kenney];
        }

        function registerTapListener() {
            var twitterTouchable = {
                id: 'twitter_letsplayIO_tap',
                x: twitter.getCornerX() - offSet,
                y: twitter.getCornerY(),
                width: twitter.getWidth(),
                height: twitter.getHeight()
            };
            self.tapController.add(twitterTouchable, function () {
                window.open('https://twitter.com/letsplayIO', '_blank');
            });
            var fbTouchable = {
                id: 'fb_letsplayIO_tap',
                x: fb.getCornerX() - offSet,
                y: fb.getCornerY(),
                width: fb.getWidth(),
                height: fb.getHeight()
            };
            self.tapController.add(fbTouchable, function () {
                window.open('https://www.facebook.com/letsplayIO', '_blank');
            });
            var letsplayIOSiteTouchable = {
                id: 'letsplayIO_site_tap',
                x: letsplayIO.getCornerX() - offSet,
                y: letsplayIO.getCornerY(),
                width: letsplayIO.getWidth(),
                height: letsplayIO.getHeight()
            };
            self.tapController.add(letsplayIOSiteTouchable, function () {
                window.open('http://letsplay.io/', '_blank');
            });
            return [twitterTouchable, fbTouchable, letsplayIOSiteTouchable];
        }

        function unRegisterTapListener(touchables) {
            touchables.forEach(self.tapController.remove.bind(self.tapController));
        }

        fadeOut(previousScenesDrawables);
        var creditsDrawables = drawCreditsScreen();
        var touchables = registerTapListener();
        fadeOut(creditsDrawables);


        var backTouchable = {
            id: 'back_tap',
            x: 0,
            y: 0,
            width: calcScreenConst(screenWidth, 4),
            height: screenHeightQuarter
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
            fadeIn(previousScenesDrawables);

            window.setTimeout(function () {
                self.next(nextScene);
                removeDrawables();
            }, 1500);
        }

    };

    Credits.prototype.next = function (nextScene) {
        nextScene();
    };

    return Credits;
})(Transition, window, calcScreenConst);