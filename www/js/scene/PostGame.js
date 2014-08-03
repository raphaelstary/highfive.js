var PostGame = (function (localStorage, Transition, calcScreenConst, BackGroundHelper, Repository, changeCoords, changePath, changeTouchable) {
    "use strict";

    function PostGame(stage, sceneStorage, tapController, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.tapController = tapController;
        this.resizeBus = resizeBus;
    }

    PostGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var points = this.sceneStorage.points || 0;
        delete this.sceneStorage.points;

        this.resizeBus.add('post_game_scene', this.resize.bind(this));
        this.resizeRepo = new Repository();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        var self = this;

        function getWidthHalf() {
            return calcScreenConst(self.screenWidth, 2);
        }

        var widthHalf = getWidthHalf();

        function getGameOverY() {
            return calcScreenConst(self.screenHeight, 5);
        }

        var gameOverY = getGameOverY();

        function getGameOverStartY() {
            return getGameOverY() - self.screenHeight;
        }

        var gameOverStartY = getGameOverStartY();

        var gameOverWrapper = self.stage.moveFresh(widthHalf, gameOverStartY, 'gameover', widthHalf, gameOverY, 60, Transition.EASE_OUT_ELASTIC, false, function () {
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

            var scoreWrapper = self.stage.moveFresh(widthHalf, getScoreStartY(), 'score', widthHalf, getScoreY(), 60,
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

            var digitLabelOffset = self.stage.getSubImage('num/numeral0').height * 2;

            function getNewScoreY() {
                return getScoreY() + digitLabelOffset;
            }

            function getNewScoreStartY() {
                return getNewScoreY() - self.screenHeight;
            }

            var digitOffset = self.stage.getSubImage('num/numeral0').width;

            var commonKeyPartForNumbers = 'num/numeral',
                i, x;

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
                        commonKeyPartForNumbers + pointsInString[i], x, getNewScoreY(), 60, Transition.EASE_OUT_BOUNCE,
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

            var bestWrapper = self.stage.moveFreshLater(widthHalf, bestStartY, 'best', widthHalf, bestY, 60,
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

            var allTimeHighScore = localStorage.getItem('allTimeHighScore');
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
                    commonKeyPartForNumbers + allTimeHighScore[i], x, highScoreY, 60, Transition.EASE_OUT_BOUNCE, 15,
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
            var playWrapper = self.stage.moveFreshLater(widthHalf, playStartY, 'play', widthHalf, playY, 60, Transition.EASE_OUT_BOUNCE, 20, false, function () {

                var touchable = {id: 'play_again_tap', x: 0, y: 0, width: self.screenWidth, height: self.screenHeight};

                self.resizeRepo.add(playDrawable, function () {
                    changeCoords(playDrawable, getWidthHalf(), getPlayY());
                    changeTouchable(touchable, 0, 0, self.screenWidth, self.screenHeight);
                });

                self.tapController.add(touchable, function () {
                    // end event
                    self.tapController.remove(touchable);
                    playDrawable.img = self.stage.getSubImage('play-active');

                    var playPathOut = self.stage.getPath(playDrawable.x, playDrawable.y, playDrawable.x,
                            playDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
                    self.stage.move(playDrawable, playPathOut, function () {
                        self.stage.remove(playDrawable);
                    });
                    self.resizeRepo.add(playDrawable, function () {
                        changeCoords(playDrawable, getWidthHalf(), getPlayY());
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

                        self.resizeBus.remove('post_game_scene');
                        delete self.resizeRepo;
                        nextScene();
                    }}, 25, function () {
                        if (points > parseInt(allTimeHighScore, 10)) {
                            localStorage.setItem('allTimeHighScore', points);
                        }
                    });
                });
            });
            var playDrawable = playWrapper.drawable;
            self.resizeRepo.add(playDrawable, function () {
                changeCoords(playDrawable, getWidthHalf(), getPlayStartY());
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