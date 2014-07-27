var Tutorial = (function (Transition, calcScreenConst) {
    "use strict";

    function Tutorial(stage, tapController, messages) {
        this.stage = stage;
        this.tapController = tapController;
        this.messages = messages;
    }

    Tutorial.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var widthHalf = calcScreenConst(screenWidth, 2);
        var heightHalf = calcScreenConst(screenHeight, 2);
        var txt = this.stage.getDrawableText(widthHalf, heightHalf, 1, this.messages.get('tutorial', 'drain_energy'),
            30, 'KenPixelBlocks', 'white', Math.PI / 4);
        this.stage.draw(txt);

        var self = this;
        var offSet = calcScreenConst(screenHeight, 8);
        var heightQuarter = calcScreenConst(screenHeight, 4);
        var touchHoldDrawable = self.stage.animateFresh(-screenWidth, heightQuarter - offSet,
            'touch_hold-anim/touch_hold', 60);
        var crushAsteroidsDrawable = self.stage.animateFresh(-screenWidth, heightHalf - offSet,
            'crush_asteroids-anim/crush_asteroids', 45);
        var shieldsEnergyDrawable = self.stage.animateFresh(-screenWidth, heightQuarter * 3 - offSet,
            'shields_energy-anim/shields_energy', 60);
        var collectBonusDrawable = self.stage.animateFresh(-screenWidth, screenHeight - offSet,
            'collect_bonus-anim/collect_bonus', 45);
        var pathIn = self.stage.getPath(-screenWidth, 0, widthHalf, 0, 60, Transition.EASE_OUT_BOUNCE);

        self.stage.move(touchHoldDrawable, pathIn);
        self.stage.moveLater({item: crushAsteroidsDrawable, path: pathIn}, 5);
        self.stage.moveLater({item: shieldsEnergyDrawable, path: pathIn}, 10);
        self.stage.moveLater({item: collectBonusDrawable, path: pathIn, ready: function () {
            var pressPlay = self.stage.getDrawable(widthHalf, heightQuarter * 3, 'play');
            self.stage.draw(pressPlay);
            var touchable = {id: 'play_tap', x: pressPlay.getCornerX(), y: pressPlay.getCornerY(),
                width: pressPlay.getEndX() - pressPlay.getCornerX(),
                height: pressPlay.getEndY() - pressPlay.getCornerY()};

            self.tapController.add(touchable, function () {
                // end event
                self.tapController.remove(touchable);

                var pressPlaySprite = self.stage.getSprite('press-play-anim/press_play', 16, false);
                self.stage.animate(pressPlay, pressPlaySprite, function () {

                    self.stage.remove(pressPlay);

                    var pathOut = self.stage.getPath(widthHalf, 0, screenWidth * 2, 0, 60, Transition.EASE_IN_EXPO);

                    self.stage.move(touchHoldDrawable, pathOut);
                    self.stage.moveLater({item: crushAsteroidsDrawable, path: pathOut}, 5);
                    self.stage.moveLater({item: shieldsEnergyDrawable, path: pathOut}, 10);
                    self.stage.moveLater({item: collectBonusDrawable, path: pathOut, ready: function () {
                        self.stage.remove(touchHoldDrawable);
                        self.stage.remove(crushAsteroidsDrawable);
                        self.stage.remove(shieldsEnergyDrawable);
                        self.stage.remove(collectBonusDrawable);

                        nextScene();
                    }}, 15);
                });
            });

        }}, 15);
    };

    return Tutorial;
})(Transition, calcScreenConst);