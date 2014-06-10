var Intro = (function (Transition) {
    "use strict";

    function Intro(stage, sceneStorage, gameLoop) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
    }

    Intro.prototype.show = function (nextScene) {
        var firstBg = this.stage.drawFresh(320 / 2, 480 / 2, 'background', 0);
        var firstBgPath = this.stage.getPath(320 / 2, 480 / 2, 320 / 2, 480 / 2 - 480, 120, Transition.LINEAR);

        var scrollingBackGround = this.stage.getDrawable(320 / 2, 480 / 2 + 480, 'background', 0);
        var scrollingBgPath = this.stage.getPath(320 / 2, 480 / 2 + 480, 320 / 2, 480 / 2, 120, Transition.LINEAR);

        var self = this;

        var speedY = 0; // 600

        var speedDrawableOne = this.stage.getDrawable(320 / 4, speedY, 'speed', 1);
        var speedDrawableTwo = this.stage.getDrawable(320 / 8 * 7, speedY - 100, 'speed', 1);
        var speedDrawableThree = this.stage.getDrawable(320 / 16, speedY - 200, 'speed', 1);
        var speedDrawableFour = this.stage.getDrawable(320 / 16 * 7, speedY - 300, 'speed', 1);
        var speedDrawableFive = this.stage.getDrawable(320 / 16, speedY - 400, 'speed', 1);
        var speedDrawableSix = this.stage.getDrawable(320 / 3 * 2, speedY - 450, 'speed', 1);

        var x = 320 / 2,
            y = 480 + 20,
            yEnd = -20;

        var letsplayIO = this.stage.getDrawable(x, y + 50, 'letsplayIO', 2);
        var letsplayIOPath = this.stage.getPath(x, y + 50, x, yEnd - 50, 120, Transition.EASE_OUT_IN_SIN);

        var presentsDrawable = this.stage.getDrawable(x, y, 'presents', 2);
        var presentsPath = this.stage.getPath(x, y + 100, x, 30, 120, Transition.EASE_OUT_IN_SIN);

        var logoYEnd = 480 / 6;
        var logoDrawable = this.stage.animateFresh(x, y, 'logo-anim/logo', 44);
        var logoInPath = this.stage.getPath(x, y, x, logoYEnd, 120, Transition.EASE_OUT_QUAD);

        var lastY = letsplayIO.y;
        var speedos = [speedDrawableOne, speedDrawableTwo, speedDrawableThree, speedDrawableFour, speedDrawableFive, speedDrawableSix];
        speedos.forEach(function (speeeed) {
            self.stage.draw(speeeed);
        });

        var hasNotStarted = true;
        this.gameLoop.add('z_parallax', function () {
            var delta = lastY - letsplayIO.y;
            lastY = letsplayIO.y;

            speedos.forEach(function (speeeeeeed) {
                speeeeeeed.y += 10;

                speeeeeeed.y -= delta * 2;

                if (speeeeeeed.y > 600) {
                    self.stage.remove(speeeeeeed);
                }
            });

            if (speedDrawableOne.y >= 480 && hasNotStarted) {
                hasNotStarted = false;

                self.stage.move(firstBg, firstBgPath, function () {
                    self.stage.remove(firstBg);
                });
                self.stage.move(scrollingBackGround, scrollingBgPath, function () {
                    scrollingBackGround.y = 480 / 2;
                });

                self.stage.move(letsplayIO, letsplayIOPath, function () {
                    self.stage.remove(letsplayIO);
                });

                self.stage.move(presentsDrawable, presentsPath, function () {
                    self.stage.remove(presentsDrawable);
                });

                var speedStripes;
                self.stage.moveLater({item: logoDrawable, path: logoInPath, ready: function () {

                    self.gameLoop.remove('z_parallax');
                    self.next(nextScene, logoDrawable, speedStripes);

                }}, 90, function () {
                    var delay = 30;
                    speedStripes = showSpeedStripes(self.stage, delay);
                });
            }
        });

        function showSpeedStripes(stage, delay) {
            var speedStripes = [];

            speedStripes.push(drawSpeed(stage, 320 / 4, 0 + delay));
            speedStripes.push(drawSpeed(stage, 320 / 3 * 2, 34 + delay));
            speedStripes.push(drawSpeed(stage, 320 / 8 * 7, 8 + delay));
            speedStripes.push(drawSpeed(stage, 320 / 16 * 7, 24 + delay));
            speedStripes.push(drawSpeed(stage, 320 / 16, 16 + delay));

            return speedStripes;
        }

        function drawSpeed(stage, x, delay) {
            return stage.moveFreshLater(x, -108 / 2, 'speed', x, 480 + 108 / 2, 30, Transition.LINEAR, delay, true);
        }
    };

    Intro.prototype.next = function (nextScene, logoDrawable, speedStripes) {
        this.sceneStorage.logo = logoDrawable;
        this.sceneStorage.speedStripes = speedStripes;

        nextScene();
    };

    return Intro;
})(Transition);