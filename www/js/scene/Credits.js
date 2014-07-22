var Credits = (function (Transition, window) {
    "use strict";

    function Credits(stage, tapController, messages) {
        this.stage = stage;
        this.tapController = tapController;
        this.messages = messages;
    }

    Credits.prototype.show = function (nextScene, previousScenesDrawables) {
        var self = this;
        var length = 320;

        function fadeOut(drawables) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x - length, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.stage.move(drawable, path);
            });
        }

        function fadeIn(drawables) {
            drawables.forEach(function (drawable) {
                var path = self.stage.getPath(drawable.x, drawable.y, drawable.x + length, drawable.y, 60,
                    Transition.EASE_IN_OUT_QUAD);
                self.stage.move(drawable, path);
            });
        }

        function drawCreditsScreen() {
            var offSet = length;
            var topRaster = 480 / 100 * 8;
            var back = self.stage.drawFresh(320 / 10 + offSet, topRaster, 'back');

            var KEN_PIXEL_BLOCKS = 'KenPixelBlocks';
            var LIGHT_GREY = '#c4c4c4';
            var a_txt = self.stage.getDrawableText(320 / 2 + offSet, 480 / 4 - 40, 3, self.messages.get('credits', 'a'),
                25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(a_txt);

            var game_txt = self.stage.getDrawableText(320 / 2 + offSet, 480 / 4, 3, self.messages.get('credits', 'game'),
                45, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(game_txt);

            var by_txt = self.stage.getDrawableText(320 / 2 + offSet, 480 / 4 + 40, 3, self.messages.get('credits', 'by'),
                25, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(by_txt);

            var letsplayIO = self.stage.drawFresh(320 / 2 + offSet, 480 / 2, 'credits-logo');
            var fb = self.stage.drawFresh(320 / 2 - 18 + offSet, 480 / 2 + 40, 'credits-facebook');
            var twitter = self.stage.drawFresh(320 / 2 + 18 + offSet, 480 / 2 + 40, 'credits-twitter');

            var graphics_txt = self.stage.getDrawableText(320 / 2 + offSet, 480 / 4 * 3, 3, self.messages.get('credits', 'graphics'),
                20, KEN_PIXEL_BLOCKS, LIGHT_GREY);
            self.stage.draw(graphics_txt);
            var kenney = self.stage.drawFresh(320 / 2 + offSet, 480 / 4 * 3 + 50, 'kenney');

            return [back, a_txt, game_txt, by_txt, letsplayIO, fb, twitter, graphics_txt, kenney];
        }

        function registerTapListener() {
            var twitterTouchable = {id: 'twitter_letsplayIO_tap', x: 320 / 2 + 18 - 20, y: 480 / 2 + 40 - 20,
                width: 40, height: 40};
            self.tapController.add(twitterTouchable, function () {
                window.open('https://twitter.com/letsplayIO', '_blank');
            });
            var fbTouchable = {id: 'fb_letsplayIO_tap', x: 320 / 2 - 18 - 20, y: 480 / 2 + 40 - 20,
                width: 40, height: 40};
            self.tapController.add(fbTouchable, function () {
                window.open('https://www.facebook.com/letsplayIO', '_blank');
            });
            var letsplayIOSiteTouchable = {id: 'letsplayIO_site_tap', x: 320 / 2 - 100, y: 480 / 2 - 20,
                width: 200, height: 40};
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
        fadeOut(creditsDrawables);
        var touchables = registerTapListener();

        var backTouchable = {id: 'back_tap', x: 0, y: 0, width: 320 / 4, height: 480 / 4};
        self.tapController.add(backTouchable, endScene);
        touchables.push(backTouchable);

        function endScene() {
            unRegisterTapListener(touchables);
            fadeIn(creditsDrawables);
            function removeDrawables() {
                creditsDrawables.forEach(self.stage.remove.bind(self.stage));
            }
            fadeIn(previousScenesDrawables);
            self.next(nextScene);
            setTimeout(removeDrawables, 2000);
        }

    };

    Credits.prototype.next = function (nextScene) {
        nextScene();
    };

    return Credits;
})(Transition, window);