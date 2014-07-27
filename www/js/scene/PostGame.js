var PostGame = (function (localStorage, Transition, calcScreenConst) {
    "use strict";

    function PostGame(stage, sceneStorage, tapController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
    }

    PostGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var points = this.sceneStorage.points;
        delete this.sceneStorage.points;

        var self = this;
        var widthHalf = calcScreenConst(screenWidth, 2);
        var gameOverX = widthHalf;
        var gameOverY = calcScreenConst(screenHeight, 5);
        var gameOverStartY = gameOverY - screenHeight;

        var gameOverDrawable = self.stage.moveFresh(gameOverX, gameOverStartY, 'gameover', gameOverX, gameOverY, 60,
            Transition.EASE_OUT_ELASTIC, false, function () {

            var scoreX = widthHalf;
            var scoreY = calcScreenConst(screenHeight, 3);
            var scoreStartY = scoreY - screenHeight;

            var scoreDrawable = self.stage.moveFresh(scoreX, scoreStartY, 'score', scoreX, scoreY, 60,
                Transition.EASE_OUT_BOUNCE);

            var digitLabelOffset = self.stage.getSubImage('num/numeral0').height * 2;
            var newScoreY = scoreY + digitLabelOffset;
            var newScoreStartY = newScoreY - screenHeight;
            var digitOffset = self.stage.getSubImage('num/numeral0').width;

            var commonKeyPartForNumbers = 'num/numeral',
                i, x;

            var pointsInString = points.toString();
            var scoreFirstDigitX = widthHalf - ((pointsInString.length - 1) * 10); //screenWidth / 3;

            var newScoreDigits = [];
            for (i = 0; i < pointsInString.length; i++) {
                x = scoreFirstDigitX + i * digitOffset;
                var scoreDigitDrawable = self.stage.moveFreshLater(x, newScoreStartY,
                        commonKeyPartForNumbers + pointsInString[i], x, newScoreY, 60, Transition.EASE_OUT_BOUNCE, 5);
                newScoreDigits.push(scoreDigitDrawable);
            }

            var bestX = widthHalf;
            var bestY = calcScreenConst(screenHeight, 2);
            var bestStartY = bestY - screenHeight;

            var bestDrawable = self.stage.moveFreshLater(bestX, bestStartY, 'best', bestX, bestY, 60,
                Transition.EASE_OUT_BOUNCE, 10);

            var allTimeHighScore = localStorage.getItem('allTimeHighScore');
            if (allTimeHighScore == null) {
                allTimeHighScore = "0";
            }

            var highScoreY = bestY + digitLabelOffset;
            var highScoreStartY = highScoreY - screenHeight;

            var highScoreFirstDigitX = widthHalf - ((allTimeHighScore.length - 1) * 10);

            var highScoreDigits = [];
            for (i = 0; i < allTimeHighScore.length; i++) {
                x = highScoreFirstDigitX + i * digitOffset;
                var highScoreDigitDrawable = self.stage.moveFreshLater(x, highScoreStartY,
                    commonKeyPartForNumbers + allTimeHighScore[i], x, highScoreY, 60, Transition.EASE_OUT_BOUNCE, 15);
                highScoreDigits.push(highScoreDigitDrawable);
            }

            var playX = widthHalf;
            var playY = calcScreenConst(screenHeight, 4, 3);
            var playStartY = playY - screenHeight;
            var playDrawable = self.stage.moveFreshLater(playX, playStartY, 'play', playX, playY, 60,
                Transition.EASE_OUT_BOUNCE, 20, false, function () {

                    var touchable = {id: 'play_again_tap', x: 0, y: 0, width: screenWidth, height: screenHeight};
                    self.tapController.add(touchable, function () {
                        // end event
                        self.tapController.remove(touchable);
                        playDrawable.img = self.stage.getSubImage('play-active');

                        var playPathOut = self.stage.getPath(playDrawable.x, playDrawable.y, playDrawable.x,
                                playDrawable.y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        self.stage.move(playDrawable, playPathOut, function () {
                            self.stage.remove(playDrawable);
                        });
                        var highScorePathOut = self.stage.getPath(highScoreDigits[0].x, highScoreDigits[0].y,
                            highScoreDigits[0].x, highScoreDigits[0].y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        highScoreDigits.forEach(function (elem, index) {
                            self.stage.moveLater({item: elem, path: highScorePathOut, ready: function () {
                                self.stage.remove(elem);
                            }}, 5 + index);
                        });
                        var bestPathOut = self.stage.getPath(bestDrawable.x, bestDrawable.y, bestDrawable.x,
                                bestDrawable.y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: bestDrawable, path: bestPathOut, ready: function () {
                            self.stage.remove(bestDrawable);
                        }}, 10);
                        var newScorePathOut = self.stage.getPath(0, newScoreDigits[0].y, 0,
                                newScoreDigits[0].y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        newScoreDigits.forEach(function (elem, index) {
                            self.stage.moveLater({item: elem, path: newScorePathOut, ready: function () {
                                self.stage.remove(elem);
                            }}, 15 + index);
                        });
                        var scorePathOut = self.stage.getPath(scoreDrawable.x, scoreDrawable.y, scoreDrawable.x,
                                scoreDrawable.y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: scoreDrawable, path: scorePathOut, ready: function () {
                            self.stage.remove(scoreDrawable);
                        }}, 20);
                        var gameOverPathOut = self.stage.getPath(gameOverDrawable.x, gameOverDrawable.y,
                            gameOverDrawable.x, gameOverDrawable.y + screenHeight, 30, Transition.EASE_IN_EXPO);
                        self.stage.moveLater({item: gameOverDrawable, path: gameOverPathOut, ready: function () {
                            self.stage.remove(gameOverDrawable);

                            nextScene();
                        }}, 25, function () {
                            if (points > parseInt(allTimeHighScore, 10)) {
                                localStorage.setItem('allTimeHighScore', points);
                            }
                        });
                    });
                });
        });
    };

    PostGame.prototype.next = function () {


//        self._preGameScene(stage, self.stage.animateFresh(widthHalf, screenHeight / 6, 'logo-anim/logo', 44),
//            self._showSpeedStripes(stage, 0)); //TODO show speed stripes in intro
    };

    return PostGame;
})(window.localStorage, Transition, calcScreenConst);