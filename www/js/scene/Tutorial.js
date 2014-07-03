var Tutorial = (function (Transition) {
    "use strict";

    function Tutorial(stage, tapController) {
        this.stage = stage;
        this.tapController = tapController;
    }

    Tutorial.prototype.show = function (nextScene) {
        this.stage.draw({
            id: 'supitxt',
            x: 320 / 2,
            y: 480 / 2,
            txt: 'TEST',
            fontFamily: 'KenPixelBlocks',
            size: '20pt'
        });

        var self = this;
        var offSet = 480 / 4 / 2;
        var touchHoldDrawable = self.stage.animateFresh(-320, 480 / 4 - offSet, 'touch_hold-anim/touch_hold', 60);
        var crushAsteroidsDrawable = self.stage.animateFresh(-320, 480 / 2 - offSet, 'crush_asteroids-anim/crush_asteroids', 45);
        var shieldsEnergyDrawable = self.stage.animateFresh(-320, 480 / 4 * 3 - offSet, 'shields_energy-anim/shields_energy', 60);
        var collectBonusDrawable = self.stage.animateFresh(-320, 480 - offSet, 'collect_bonus-anim/collect_bonus', 45);
        var pathIn = self.stage.getPath(-320, 0, 320 / 2, 0, 60, Transition.EASE_OUT_BOUNCE);

        self.stage.move(touchHoldDrawable, pathIn);
        self.stage.moveLater({item: crushAsteroidsDrawable, path: pathIn}, 5);
        self.stage.moveLater({item: shieldsEnergyDrawable, path: pathIn}, 10);
        self.stage.moveLater({item: collectBonusDrawable, path: pathIn, ready: function () {
            var pressPlay = self.stage.getDrawable(320 / 2, 480 / 4 * 3, 'play');
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

                    var pathOut = self.stage.getPath(320 / 2, 0, 320 * 2, 0, 60, Transition.EASE_IN_EXPO);

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
})(Transition);