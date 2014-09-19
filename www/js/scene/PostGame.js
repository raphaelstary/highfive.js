var PostGame = (function (localStorage, Transition, calcScreenConst, BackGroundHelper, Repository, changeCoords, changePath, changeTouchable) {
    "use strict";

    function PostGame(stage, sceneStorage, tapController, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    var POST_GAME_SCENE = 'post_game_scene';
    var GAME_OVER = 'game_over';
    var SCORE = 'score';
    var ZERO = 'numeral_0';
    var NUMERAL = 'numeral_';
    var BEST = 'best';
    var ALL_TIME_HIGH_SCORE = 'allTimeHighScore';
    var CLICK = 'click';
    var BUTTON_PRIM_ACTIVE = 'button_primary_active';
    var BUTTON_PRIM = 'button_primary';
    var FONT = 'KenPixel';
    var FONT_COLOR = '#fff';
    var POST_GAME_MSG_KEY = 'game_over';
    var PLAY_AGAIN_MSG = 'play_again';
    var BLACK = '#000';

    PostGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var points = this.sceneStorage.points || 0;
        delete this.sceneStorage.points;

        this.resizeBus.add(POST_GAME_SCENE, this.resize.bind(this));
        this.resizeRepo = new Repository();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        var self = this;

        function getWidthHalf() {
            return calcScreenConst(self.screenWidth, 2);
        }

        function getGameOverY() {
            return calcScreenConst(self.screenHeight, 5);
        }

        function getGameOverStartY() {
            return getGameOverY() - self.screenHeight;
        }

        var gameOverWrapper = self.stage.moveFresh(getWidthHalf(), getGameOverStartY(), GAME_OVER, getWidthHalf(), getGameOverY(), 60, Transition.EASE_OUT_ELASTIC, false, function () {
            self.resizeRepo.add(gameOverDrawable, realGameOverResizing);

            function realGameOverResizing() {
                changeCoords(gameOverDrawable, getWidthHalf(), getGameOverY());
            }

            function getScoreY() {
                return calcScreenConst(self.screenHeight, 3);
            }

            function getScoreStartY() {
                return getScoreY() - self.screenHeight;
            }

            var scoreWrapper = self.stage.moveFresh(getWidthHalf(), getScoreStartY(), SCORE, getWidthHalf(), getScoreY(), 60,
                Transition.EASE_OUT_BOUNCE, false, function () {
                    self.resizeRepo.add(scoreDrawable, realScoreTxtResizing);
                });

            function realScoreTxtResizing() {
                changeCoords(scoreDrawable, getWidthHalf(), getScoreY());
            }

            var scoreDrawable = scoreWrapper.drawable;
            self.resizeRepo.add(scoreDrawable, function () {
                changeCoords(scoreDrawable, getWidthHalf(), getScoreStartY());
                changePath(scoreWrapper.path, getWidthHalf(), getScoreStartY(), getWidthHalf(), getScoreY());
            });

            var digitLabelOffset = self.stage.getSubImage(ZERO).height * 2;

            function getNewScoreY() {
                return getScoreY() + digitLabelOffset;
            }

            function getNewScoreStartY() {
                return getNewScoreY() - self.screenHeight;
            }

            var digitOffset = self.stage.getSubImage(ZERO).width;

            var i, x;

            var pointsInString = points.toString();

            function getScore1stDigitX() {
                return getWidthHalf() - ((pointsInString.length - 1) * 10);
            }

            function getScoreDynamicX(index) {
                return getScore1stDigitX() + index * digitOffset;
            }

            var newScoreDigits = [];
            for (i = 0; i < pointsInString.length; i++) {
                x = getScoreDynamicX(i);
                var scoreDigitDrawable = self.stage.moveFreshLater(x, getNewScoreStartY(),
                        NUMERAL + pointsInString[i], x, getNewScoreY(), 60, Transition.EASE_OUT_BOUNCE,
                    5, false, resizeScore);
                newScoreDigits.push(scoreDigitDrawable);
            }

            function resizeScoreInMotion() {
                newScoreDigits.forEach(function (wrapper, index) {
                    var x = getScoreDynamicX(index);
                    changeCoords(wrapper.drawable, x, getNewScoreStartY());
                    changePath(wrapper.path, x, getNewScoreStartY(), x, getNewScoreY());
                });
            }

            self.resizeRepo.add(newScoreDigits[0].drawable, resizeScoreInMotion);

            var digitsLeft = newScoreDigits.length;
            function resizeScore() {
                if (--digitsLeft > 0)
                    return;

                digitsLeft = newScoreDigits.length;
                self.resizeRepo.add(newScoreDigits[0].drawable, realScoreResizing);
            }

            function realScoreResizing() {
                newScoreDigits.forEach(function (wrapper, index) {
                    var x = getScoreDynamicX(index);
                    changeCoords(wrapper.drawable, x, getNewScoreY());
                });
            }

            function getBestY() {
                return calcScreenConst(self.screenHeight, 2);
            }

            var bestY = getBestY();

            function getBestStartY() {
                return getBestY() - self.screenHeight;
            }

            var bestStartY = getBestStartY();

            var bestWrapper = self.stage.moveFreshLater(getWidthHalf(), bestStartY, BEST, getWidthHalf(), bestY, 60,
                Transition.EASE_OUT_BOUNCE, 10, false, function () {
                    self.resizeRepo.add(bestDrawable, realBestResizing);
                });
            function realBestResizing() {
                changeCoords(bestDrawable, getWidthHalf(), getBestY());
            }
            var bestDrawable = bestWrapper.drawable;
            self.resizeRepo.add(bestDrawable, function () {
                changeCoords(bestDrawable, getWidthHalf(), getBestStartY());
                changePath(bestWrapper.path, getWidthHalf(), getBestStartY(), getWidthHalf(), getBestY());
            });

            var allTimeHighScore = localStorage.getItem(ALL_TIME_HIGH_SCORE);
            if (allTimeHighScore == null) {
                allTimeHighScore = "0";
            }

            function getHighScoreY() {
                return getBestY() + digitLabelOffset;
            }

            var highScoreY = getHighScoreY();

            function getHighScoreStartY() {
                return getHighScoreY() - self.screenHeight;
            }

            var highScoreStartY = getHighScoreStartY();

            function getHighScore1stDigitX() {
                return getWidthHalf() - ((allTimeHighScore.length - 1) * 10);
            }

            var highScoreDigits = [];
            for (i = 0; i < allTimeHighScore.length; i++) {
                x = getHighScore1stDigitX() + i * digitOffset;
                highScoreDigits.push(self.stage.moveFreshLater(x, highScoreStartY,
                    NUMERAL + allTimeHighScore[i], x, highScoreY, 60, Transition.EASE_OUT_BOUNCE, 15,
                    false, resizeHighScore));
            }

            var highScoreDigitsLeft = highScoreDigits.length;
            function resizeHighScore() {
                if (--highScoreDigitsLeft > 0)
                    return;
                highScoreDigitsLeft = highScoreDigits.length;
                self.resizeRepo.add(highScoreDigits[0].drawable, realHighScoreResizing);
            }

            function realHighScoreResizing() {
                highScoreDigits.forEach(function (wrapper, index) {
                    var x = getHighScore1stDigitX() + index * digitOffset;
                    changeCoords(wrapper.drawable, x, getHighScoreY());
                });
            }

            function resizeHighScoreInMotion() {
                highScoreDigits.forEach(function (wrapper, index) {
                    var x = getHighScore1stDigitX() + index * digitOffset;
                    changeCoords(wrapper.drawable, x, getHighScoreStartY());
                    changePath(wrapper.path, x, getHighScoreStartY(), x, getHighScoreY());
                });
            }

            self.resizeRepo.add(highScoreDigits[0].drawable, resizeHighScoreInMotion);

            function getPlayY() {
                return calcScreenConst(self.screenHeight, 4, 3);
            }

            var playY = getPlayY();

            function getPlayStartY() {
                return getPlayY() - self.screenHeight;
            }

            var playStartY = getPlayStartY();
            var playTxt = self.stage.getDrawableText(getWidthHalf(), playStartY, 3, self.messages.get(POST_GAME_MSG_KEY, PLAY_AGAIN_MSG), 15,
                FONT, FONT_COLOR);
            self.stage.draw(playTxt);
            var playWrapper = self.stage.moveFreshLater(getWidthHalf(), playStartY, BUTTON_PRIM, getWidthHalf(), playY, 60, Transition.EASE_OUT_BOUNCE, 20, false, function () {

                var touchable = {id: 'play_again_tap', x: 0, y: 0, width: self.screenWidth, height: self.screenHeight};

                self.resizeRepo.add(playDrawable, function () {
                    changeCoords(playDrawable, getWidthHalf(), getPlayY());
                    changeCoords(playTxt, getWidthHalf(), getPlayY());
                    changeTouchable(touchable, 0, 0, self.screenWidth, self.screenHeight);
                });

                self.tapController.add(touchable, function () {
                    self.sounds.play(CLICK);
                    // end event
                    self.tapController.remove(touchable);
                    playDrawable.img = self.stage.getSubImage(BUTTON_PRIM_ACTIVE);
                    playTxt.txt.color = BLACK;

                    var playPathOut = self.stage.getPath(playDrawable.x, playDrawable.y, playDrawable.x,
                            playDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    self.stage.move(playDrawable, playPathOut, function () {
                        self.stage.remove(playDrawable);
                        self.stage.remove(playTxt);
                    });
                    self.resizeRepo.add(playDrawable, function () {
                        changeCoords(playDrawable, getWidthHalf(), getPlayY());
                        changeCoords(playTxt, getWidthHalf(), getPlayY());
                        changePath(playPathOut, getWidthHalf(), getPlayY() + self.screenHeight);
                    });

                    var highScorePathOut = self.stage.getPath(highScoreDigits[0].drawable.x, highScoreDigits[0].drawable.y,
                        highScoreDigits[0].drawable.x, highScoreDigits[0].drawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    highScoreDigits.forEach(function (elem, index) {
                        self.stage.moveLater({item: elem.drawable, path: highScorePathOut, ready: function () {
                            self.stage.remove(elem.drawable);
                        }}, 5 + index);
                    });
                    self.resizeRepo.add(highScoreDigits[0].drawable, function () {
                        realHighScoreResizing();
                        changePath(highScorePathOut, highScoreDigits[0].drawable.x, highScoreDigits[0].drawable.y,
                            highScoreDigits[0].drawable.x, highScoreDigits[0].drawable.y + self.screenHeight);
                    });

                    var bestPathOut = self.stage.getPath(bestDrawable.x, bestDrawable.y, bestDrawable.x,
                            bestDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    self.stage.moveLater({item: bestDrawable, path: bestPathOut, ready: function () {
                        self.stage.remove(bestDrawable);
                    }}, 10);
                    self.resizeRepo.add(bestDrawable, function () {
                        realBestResizing();
                        changePath(bestPathOut, bestDrawable.x, bestDrawable.y, bestDrawable.x,
                                bestDrawable.y + self.screenHeight);
                    });

                    var newScorePathOut = self.stage.getPath(0, newScoreDigits[0].drawable.y, 0,
                            newScoreDigits[0].drawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    newScoreDigits.forEach(function (elem, index) {
                        self.stage.moveLater({item: elem.drawable, path: newScorePathOut, ready: function () {
                            self.stage.remove(elem.drawable);
                        }}, 15 + index);
                    });
                    self.resizeRepo.add(newScoreDigits[0].drawable, function () {
                        realScoreResizing();
                        changePath(newScorePathOut, 0, newScoreDigits[0].drawable.y, 0,
                                newScoreDigits[0].drawable.y + self.screenHeight);
                    });

                    var scorePathOut = self.stage.getPath(scoreDrawable.x, scoreDrawable.y, scoreDrawable.x,
                            scoreDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    self.stage.moveLater({item: scoreDrawable, path: scorePathOut, ready: function () {
                        self.stage.remove(scoreDrawable);
                    }}, 20);
                    self.resizeRepo.add(scoreDrawable, function () {
                        realScoreTxtResizing();
                        changePath(scorePathOut, scoreDrawable.x, scoreDrawable.y, scoreDrawable.x,
                                scoreDrawable.y + self.screenHeight);
                    });

                    var gameOverPathOut = self.stage.getPath(gameOverDrawable.x, gameOverDrawable.y,
                        gameOverDrawable.x, gameOverDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    self.resizeRepo.add(gameOverDrawable, function () {
                        realGameOverResizing();
                        changePath(gameOverPathOut, gameOverDrawable.x, gameOverDrawable.y,
                            gameOverDrawable.x, gameOverDrawable.y + self.screenHeight);
                    });
                    self.stage.moveLater({item: gameOverDrawable, path: gameOverPathOut, ready: function () {
                        self.stage.remove(gameOverDrawable);

                        self.resizeBus.remove(POST_GAME_SCENE);
                        delete self.resizeRepo;
                        nextScene();
                    }}, 25, function () {
                        if (points > parseInt(allTimeHighScore, 10)) {
                            localStorage.setItem(ALL_TIME_HIGH_SCORE, points);
                        }
                    });
                });
            }, function () {
                self.stage.move(playTxt, playWrapper.path);
            });
            var playDrawable = playWrapper.drawable;
            self.resizeRepo.add(playDrawable, function () {
                changeCoords(playDrawable, getWidthHalf(), getPlayStartY());
                changeCoords(playTxt, getWidthHalf(), getPlayStartY());
                changePath(playWrapper.path, getWidthHalf(), getPlayStartY(), getWidthHalf(), getPlayY());
            });
        });
        var gameOverDrawable = gameOverWrapper.drawable;
        self.resizeRepo.add(gameOverDrawable, function () {
            changeCoords(gameOverDrawable, getWidthHalf(), getGameOverStartY());
            changePath(gameOverWrapper.path, getWidthHalf(), getGameOverStartY(), getWidthHalf(), getGameOverY());
        });
    };

    PostGame.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        BackGroundHelper.resize(this.sceneStorage.backGround, width, height);
        this.resizeRepo.call();
    };

    return PostGame;
})(window.localStorage, Transition, calcScreenConst, BackGroundHelper, Repository, changeCoords, changePath, changeTouchable);