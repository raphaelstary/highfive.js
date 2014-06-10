var PostGame = (function (localStorage, Transition) {
    "use strict";

    function PostGame(stage, sceneStorage, tapController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
    }

    PostGame.prototype.show = function (nextScene) {
        var points = this.sceneStorage.points;
        delete this.sceneStorage.points;

        var self = this;
        var gameOverX = 320 / 2;
        var gameOverY = 480 / 4 - 25;
        var gameOverStartY = gameOverY - 480;

        var gameOverDrawable = self.stage.moveFresh(gameOverX, gameOverStartY, 'gameover', gameOverX, gameOverY, 60, Transition.EASE_OUT_ELASTIC, false, function () {

            var scoreX = 320 / 2;
            var scoreY = 480 / 3;
            var scoreStartY = scoreY - 480;

            var scoreDrawable = self.stage.moveFresh(scoreX, scoreStartY, 'score', scoreX, scoreY, 60, Transition.EASE_OUT_BOUNCE);

            var digitLabelOffset = 35;
            var newScoreY = scoreY + digitLabelOffset;
            var newScoreStartY = newScoreY - 480;
            var digitOffset = 20;

            var commonKeyPartForNumbers = 'num/numeral',
                i, x;

            var pointsInString = points.toString();
            var scoreFirstDigitX = 320 / 2 - ((pointsInString.length - 1) * 10); //320 / 3;

            var newScoreDigits = [];
            for (i = 0; i < pointsInString.length; i++) {
                x = scoreFirstDigitX + i * digitOffset;
                var scoreDigitDrawable = self.stage.moveFreshLater(x, newScoreStartY,
                        commonKeyPartForNumbers + pointsInString[i], x, newScoreY, 60, Transition.EASE_OUT_BOUNCE, 5);
                newScoreDigits.push(scoreDigitDrawable);
            }

            var bestX = 320 / 2;
            var bestY = 480 / 2;
            var bestStartY = bestY - 480;

            var bestDrawable = self.stage.moveFreshLater(bestX, bestStartY, 'best', bestX, bestY, 60, Transition.EASE_OUT_BOUNCE, 10);

            var allTimeHighScore = localStorage.getItem('allTimeHighScore');
            if (allTimeHighScore == null) {
                allTimeHighScore = "0";
            }

            var highScoreY = bestY + digitLabelOffset;
            var highScoreStartY = highScoreY - 480;

            var highScoreFirstDigitX = 320 / 2 - ((allTimeHighScore.length - 1) * 10);

            var highScoreDigits = [];
            for (i = 0; i < allTimeHighScore.length; i++) {
                x = highScoreFirstDigitX + i * digitOffset;
                var highScoreDigitDrawable = self.stage.moveFreshLater(x, highScoreStartY,
                        commonKeyPartForNumbers + allTimeHighScore[i], x, highScoreY, 60, Transition.EASE_OUT_BOUNCE, 15);
                highScoreDigits.push(highScoreDigitDrawable);
            }

            var playX = 320 / 2;
            var playY = 480 / 4 * 3;
            var playStartY = playY - 480;
            var pressPlaySprite = self.stage.getSprite('press-play-anim/press_play', 16, false);
            var playDrawable = self.stage.moveFreshLater(playX, playStartY, 'play', playX, playY, 60, Transition.EASE_OUT_BOUNCE, 20, false, function () {

                var touchable = {id: 'play_again_tap', x: 0, y: 0, width: 320, height: 480};
                self.tapController.add(touchable, function () {
                    // end event
                    self.tapController.remove(touchable);

                    self.stage.animate(playDrawable, pressPlaySprite, function () {
                        playDrawable.img = self.stage.getSubImage('play');

                        var playPathOut = self.stage.getPath(playDrawable.x, playDrawable.y, playDrawable.x, playDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                        self.stage.move(playDrawable, playPathOut, function () {
                            self.stage.remove(playDrawable);
                        });
                        var highScorePathOut = self.stage.getPath(highScoreDigits[0].x, highScoreDigits[0].y, highScoreDigits[0].x, highScoreDigits[0].y + 480, 30, Transition.EASE_IN_EXPO);
                        highScoreDigits.forEach(function (elem, index) {
                            self.stage.moveLater({item: elem, path: highScorePathOut, ready: function () {
                                self.stage.remove(elem);
                            }}, 5 + index);
                        });
                        var bestPathOut = self.stage.getPath(bestDrawable.x, bestDrawable.y, bestDrawable.x, bestDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: bestDrawable, path: bestPathOut, ready: function () {
                            self.stage.remove(bestDrawable);
                        }}, 10);
                        var newScorePathOut = self.stage.getPath(0, newScoreDigits[0].y, 0, newScoreDigits[0].y + 480, 30, Transition.EASE_IN_EXPO);
                        newScoreDigits.forEach(function (elem, index) {
                            self.stage.moveLater({item: elem, path: newScorePathOut, ready: function () {
                                self.stage.remove(elem);
                            }}, 15 + index);
                        });
                        var scorePathOut = self.stage.getPath(scoreDrawable.x, scoreDrawable.y, scoreDrawable.x, scoreDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: scoreDrawable, path: scorePathOut, ready: function () {
                            self.stage.remove(scoreDrawable);
                        }}, 20);
                        var gameOverPathOut = self.stage.getPath(gameOverDrawable.x, gameOverDrawable.y, gameOverDrawable.x, gameOverDrawable.y + 480, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: gameOverDrawable, path: gameOverPathOut, ready: function () {
                            self.stage.remove(gameOverDrawable);

//                                if (DEBUG_START_IMMEDIATELY) {
//                                    self._preGameScene(stage, atlasMapper, null, null);
//                                } else {
//                            self.next();
                            nextScene();
//                                }
                        }}, 25, function () {
                            if (points > parseInt(allTimeHighScore, 10)) {
                                localStorage.setItem('allTimeHighScore', points);
                            }
                        });
                    });
                });
            });
        });
    };

    PostGame.prototype.next = function () {


//        self._preGameScene(stage, self.stage.animateFresh(320 / 2, 480 / 6, 'logo-anim/logo', 44),
//            self._showSpeedStripes(stage, 0)); //TODO show speed stripes in intro
    };

    return PostGame;
})(window.localStorage, Transition);