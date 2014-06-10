var PlayGame = (function (Transition) {
    "use strict";

    function PlayGame(stage, sceneStorage, gameLoop, gameController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
    }
    
    PlayGame.prototype.show = function (nextScene) {
        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields,
            energyBarDrawable = this.sceneStorage.energyBar,
            lifeDrawablesDict = this.sceneStorage.lives,
            countDrawables = this.sceneStorage.counts,
            fireDrawable = this.sceneStorage.fire,
            speedStripes = this.sceneStorage.speedStripes,
            shieldsUpSprite = this.sceneStorage.shieldsUp,
            shieldsDownSprite = this.sceneStorage.shieldsDown;

        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;
        delete this.sceneStorage.shieldsUp;
        delete this.sceneStorage.shieldsDown;

        var shaker = [shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1], lifeDrawablesDict[2],lifeDrawablesDict[3], fireDrawable];
        function addElem (elem) {
            shaker.push(elem);
        }
        countDrawables.forEach(addElem);
        speedStripes.forEach(addElem);
        var shaking = false;
        var smallShaking = false;
        var bigShaking = false;

        var shieldsOn = false; //part of global game state
        var lives = 3; //3; //part of global game state
        var initialLives = 3; // needed for right render stuff after collect or similar
        var points = 0; //part of global game state

        // level difficulty
        var maxTimeToFirst = 100;
        var percentageForAsteroid = 66;

        var asteroidSpeed = 90;
        var pauseAfterAsteroid = 30;
        var maxTimeToNextAfterAsteroid = 100;

        var starSpeed = 90;
        var pauseAfterStar = 20;
        var maxTimeToNextAfterStar = 100;

        // -------------------

        var counter = 0;
        // im interval 0 - 100 kommt ein element
        var nextCount = range(0, maxTimeToFirst);

        var trackedAsteroids = {};
        var trackedStars = {};
        var self = this;

        function generateLevel() {
            counter += 1;
            if (counter <= nextCount) {
                return;
            }

            counter = 0;

            var drawable;
            // 2/3 asteroid, 1/3 star
            if (range(1, 100) <= percentageForAsteroid) {
                drawable = drawAsteroid(self.stage, 'asteroid' + range(1, 4), range(320 / 5, 4 * 320 / 5), asteroidSpeed);
                nextCount = pauseAfterAsteroid + range(0, maxTimeToNextAfterAsteroid);

                trackedAsteroids[drawable.id] = drawable;
            } else {
                var starNum = range(1, 4);
                var starPath = 'star' + starNum + '-anim/star' + starNum;
                drawable = drawStar(self.stage, starPath, range(320 / 3, 2 * 320 / 3), starSpeed);
                nextCount = pauseAfterStar + range(0, maxTimeToNextAfterStar);

                trackedStars[drawable.id] = drawable;
            }
//            shaker.push(drawable);
        }

        var elemHitsShieldsSprite;
        var shieldsGetHitSprite;

        function initShieldsHitRenderStuff() {
            elemHitsShieldsSprite = self.stage.getSprite('shield-hit-anim/shield_hit', 12, false);
            shieldsGetHitSprite = self.stage.getSprite('shiels-hit-anim/shields_hit', 10, false); //TODO change sprite name
        }

        initShieldsHitRenderStuff();

        var shipHullHitSprite;
        var dumpLifeSprite;

        function initShipHullHitRenderStuff() {
            shipHullHitSprite = self.stage.getSprite('ship-hit-anim/ship_hit', 30, false);
            dumpLifeSprite = self.stage.getSprite('lost-life-anim/lost_life', 20, false);
        }

        initShipHullHitRenderStuff();

        function collisions() {
            var key;
            for (key in trackedAsteroids) {
                if (!trackedAsteroids.hasOwnProperty(key)) {
                    continue;
                }
                var asteroid = trackedAsteroids[key];

                if (shieldsOn && needPreciseCollisionDetectionForShields(asteroid) && isShieldsHit(asteroid)) {
                    self.stage.animate(shieldsDrawable, shieldsGetHitSprite, function () {
                        if (shieldsOn) {
                            shieldsDrawable.img = self.stage.getSubImage('shield3');
                        } else {
                            self.stage.remove(shieldsDrawable);
                        }
                    });
                    (function (asteroid) {
                        self.stage.remove(asteroid);
                        self.stage.animate(asteroid, elemHitsShieldsSprite, function () {
                            self.stage.remove(asteroid);
                        })
                    })(asteroid);
                    smallScreenShake();

                    delete trackedAsteroids[key];
                    continue;
                }

                if (needPreciseCollisionDetection(asteroid) && isHit(asteroid)) {
                    self.stage.remove(asteroid);
                    delete trackedAsteroids[key];

                    shipGotHit();
                    bigScreenShake();

                    if (lives <= 0) {
                        endGame();
                    }
//                    continue;
                }
            }

            for (key in trackedStars) {
                if (!trackedStars.hasOwnProperty(key)) {
                    continue;
                }
                var star = trackedStars[key];

                if (shieldsOn && needPreciseCollisionDetectionForShields(star) && isShieldsHit(star)) {
                    self.stage.animate(shieldsDrawable, shieldsGetHitSprite, function () {
                        if (shieldsOn) {
                            shieldsDrawable.img = self.stage.getSubImage('shield3');
                        } else {
                            self.stage.remove(shieldsDrawable);
                        }
                    });
                    (function (star) {
                        self.stage.remove(star);
                        self.stage.animate(star, elemHitsShieldsSprite, function () {
                            self.stage.remove(star);
                        })
                    })(star);

                    delete trackedStars[key];
                    continue;
                }

                if (needPreciseCollisionDetection(star) && isHit(star)) {
                    collectStar();
                    showScoredPoints(star.x, star.y);
                    increaseTotalScore(10);

                    self.stage.remove(star);
                    delete trackedStars[key];
//                    continue;
                }
            }
        }

        function shipGotHit() {
            var currentLife = lives;
            self.stage.animate(lifeDrawablesDict[currentLife], dumpLifeSprite, function () {
                self.stage.remove(lifeDrawablesDict[currentLife]);
                delete lifeDrawablesDict[currentLife];
            });

            if (--lives > 0) {
                self.stage.animate(shipDrawable, shipHullHitSprite, function () {
                    if (lives == initialLives - 1) {
                        shipDrawable.img = self.stage.getSubImage('damaged-ship2');
                    } else if (lives == initialLives - 2) {
                        shipDrawable.img = self.stage.getSubImage('damaged-ship3');
                    } else {
                        shipDrawable.img = self.stage.getSubImage('ship');
                    }
                });
            }
        }


        var scoredPointsSprite, scoredPointsDrawable;

        function initScoredPointsRenderStuff() {
            scoredPointsSprite = self.stage.getSprite('score-10-anim/score_10', 20, false);
            scoredPointsDrawable = self.stage.getDrawable(0, 0, 'score-10-anim/score_10_0000', 3);
        }

        initScoredPointsRenderStuff();

        function showScoredPoints(x, y) {
            var yOffSet = 50;
            scoredPointsDrawable.x = x;
            scoredPointsDrawable.y = y - yOffSet;
            self.stage.animate(scoredPointsDrawable, scoredPointsSprite, function () {
                self.stage.remove(scoredPointsDrawable);
            });
        }

        var sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0;
        var countSprites;
        var countStatics;

        function initIncreaseTotalScoreRenderStuff() {

            sprite0_1 = self.stage.getSprite('0_1-anim/0_1', 15, false);
            sprite1_2 = self.stage.getSprite('1_2-anim/1_2', 15, false);
            sprite2_3 = self.stage.getSprite('2_3-anim/2_3', 15, false);
            sprite3_4 = self.stage.getSprite('3_4-anim/3_4', 15, false);
            sprite4_5 = self.stage.getSprite('4_5-anim/4_5', 15, false);
            sprite5_6 = self.stage.getSprite('5_6-anim/5_6', 15, false);
            sprite6_7 = self.stage.getSprite('6_7-anim/6_7', 15, false);
            sprite7_8 = self.stage.getSprite('7_8-anim/7_8', 15, false);
            sprite8_9 = self.stage.getSprite('8_9-anim/8_9', 15, false);
            sprite9_0 = self.stage.getSprite('9_0-anim/9_0', 15, false);
            countSprites = [sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0];

            countStatics = [self.stage.getSubImage('num/numeral0'), self.stage.getSubImage('num/numeral1'), self.stage.getSubImage('num/numeral2'),
                self.stage.getSubImage('num/numeral3'), self.stage.getSubImage('num/numeral4'), self.stage.getSubImage('num/numeral5'),
                self.stage.getSubImage('num/numeral6'), self.stage.getSubImage('num/numeral7'), self.stage.getSubImage('num/numeral8'),
                self.stage.getSubImage('num/numeral9')];
        }

        initIncreaseTotalScoreRenderStuff();

        var totalScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        function increaseTotalScore(score) {
            points += score;
            var scoreString = score.toString();

            var u = 0,
                overflow = 0;

            for (var i = scoreString.length - 1; i > -1; i--) {
                addDigit(parseInt(scoreString[i], 10));
            }
            while (overflow > 0) {
                addDigit(0);
            }

            function addDigit(intToAdd) {
                var currentDigit = totalScore[u];
                var tmpAmount = currentDigit + intToAdd + overflow;
                overflow = Math.floor(tmpAmount / 10);
                var newDigit = tmpAmount % 10;

                var delta = tmpAmount - currentDigit;
                var currentDrawable = countDrawables[u];
                for (var v = 0; v < delta; v++) {
                    var currentSprite = countSprites[(currentDigit + v) % 10];
                    (function (currentDrawable, currentDigit, v) {
                        self.stage.animate(currentDrawable, currentSprite, function () {
                            currentDrawable.img = countStatics[(currentDigit + 1 + v) % 10];
                        })
                    })(currentDrawable, currentDigit, v);
                    if ((currentDigit + v) % 10 === newDigit) {
                        break;
                    }
                }

                totalScore[u] = newDigit;

                u++;
            }
        }


        var collectSprite;

        function initCollectRenderStuff() {
            collectSprite = self.stage.getSprite('collect-star-anim/collect_star', 30, false);
        }

        initCollectRenderStuff();

        function collectStar() {
            self.stage.animate(shipDrawable, collectSprite, function () {
                if (lives == initialLives - 1) {
                    shipDrawable.img = self.stage.getSubImage('damaged-ship2');
                } else if (lives == initialLives - 2) {
                    shipDrawable.img = self.stage.getSubImage('damaged-ship3');
                } else {
                    shipDrawable.img = self.stage.getSubImage('ship');
                }
            });
        }

        function needPreciseCollisionDetection(element) {
            return shipDrawable.getCornerY() <= element.getEndY();
        }

        function needPreciseCollisionDetectionForShields(element) {
            return shieldsDrawable.getCornerY() <= element.getEndY();
        }

        var collisionCanvas = document.createElement('canvas');
        var ccCtx = collisionCanvas.getContext('2d');
        var shipStaticImg = self.stage.getSubImage('ship');
        var shieldStatic = self.stage.getSubImage("shield3");
        collisionCanvas.width = shieldStatic.width; //shipStaticImg.width;
        collisionCanvas.height = shieldStatic.height; //shipStaticImg.height;
        var collisionCanvasWidth = shieldStatic.width;
        var collisionCanvasHeight = shieldStatic.height;

        function getStaticShipCornerX() {
            return shipDrawable.x - shipStaticImg.width / 2;
        }

        function getStaticShipCornerY() {
            return shipDrawable.y - shipStaticImg.height / 2;
        }

        function isHit(element) {
            ccCtx.clearRect(0, 0, collisionCanvasWidth, collisionCanvasHeight);

            var shipImg = shipStaticImg;
            var elemImg = element.img;

            ccCtx.drawImage(self.stage.renderer.atlas, shipImg.x, shipImg.y, shipImg.width, shipImg.height, 0, 0, shipImg.width, shipImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - getStaticShipCornerX();
            var y = element.getCornerY() - getStaticShipCornerY();
            ccCtx.drawImage(self.stage.renderer.atlas, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width, elemImg.height);

            ccCtx.restore();

            var rawPixelData = ccCtx.getImageData(0, 0, x + elemImg.width, y + elemImg.height).data;

            for (var i = 0; i < rawPixelData.length; i += 4) {
                var alphaValue = rawPixelData[i + 3];
                if (alphaValue != 0) {
                    return true;
                }
            }
            return false;
        }

        function isShieldsHit(element) {
            ccCtx.clearRect(0, 0, collisionCanvasWidth, collisionCanvasHeight);

            var shieldsImg = shieldsDrawable.img;
            var elemImg = element.img;

            ccCtx.drawImage(self.stage.renderer.atlas, shieldsImg.x, shieldsImg.y, shieldsImg.width, shieldsImg.height, 0, 0, shieldsImg.width, shieldsImg.height);

            ccCtx.save();
            ccCtx.globalCompositeOperation = 'source-in';

            var x = element.getCornerX() - shieldsDrawable.getCornerX();
            var y = element.getCornerY() - shieldsDrawable.getCornerY();
            ccCtx.drawImage(self.stage.renderer.atlas, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width, elemImg.height);

            ccCtx.restore();

            var rawPixelData = ccCtx.getImageData(0, 0, x + elemImg.width, y + elemImg.height).data;

            for (var i = 0; i < rawPixelData.length; i += 4) {
                var alphaValue = rawPixelData[i + 3];
                if (alphaValue != 0) {
                    return true;
                }
            }
            return false;
        }

        var time = 0;
        var duration = 60;
        var lastOffSetY;

        function shakeTheScreen() {
            if (shaking) {
                if (smallShaking) {
                    var offSet = elasticOutShake(time, duration, 25, 5);
                    shaker.forEach(function (item) {
                        if (time == 0) {
                            item._startValueX = item.x;
                        }
                        if (offSet != 0) {
                            item.x = item._startValueX + offSet;
                        } else {
                            item.x = item._startValueX;
                        }
                    });

                } else if (bigShaking) {
                    var amplitude = 150;
                    var period = 5;
                    var offSetX = elasticOutShake(time, duration, amplitude - 50, period + 5);
                    var offSetY = elasticOutShake(time, duration, amplitude, period);

                    shaker.forEach(function (item) {
                        if (time == 0) {
                            item._startValueX = item.x;
//                            item._startValueY = item.y;
                            lastOffSetY = 0;
                        }
                        if (offSetX != 0) {
                            item.x = item._startValueX + offSetX;
                        } else {
                            item.x = item._startValueX;
                        }
                        if (offSetY != 0) {
                            item.y = (item.y - lastOffSetY) + offSetY;
                        } else {
                            item.y = (item.y - lastOffSetY);
                        }
                    });
                    lastOffSetY = offSetY;
                }

                time++;
                if (time >= duration) {
                    time = 0;
                    shaking = false;

                    shaker.forEach(function (item) {
                        item.x = item._startValueX;
                        delete item._startValueX;

                        if (bigShaking) {
                            item.y = item.y - lastOffSetY;
                            lastOffSetY = 0;
                        }
                    });

                    smallShaking = false;
                    bigShaking = false;
                }
            }
        }

        function smallScreenShake() {
            if (shaking) {
                if (bigShaking) {
                    return;
                }
                shaker.forEach(function (item) {
                    item.x = item._startValueX;
                });
            }

            shaking = true;
            time = 0;
            smallShaking = true;
        }

        function bigScreenShake() {
            if (shaking) {
                if (smallShaking) {
                    smallShaking = false;
                }

                shaker.forEach(function (item) {
                    item.x = item._startValueX;
                });

                if (bigShaking) {
                    shaker.forEach(function (item) {
                        item.y = item.y - lastOffSetY;
                    });
                    lastOffSetY = 0;
                }
            }

            shaking = true;
            time = 0;
            bigShaking = true;
        }

        function elasticOutShake(currentTime, duration, amplitude, period) {
            if (currentTime == 0 || (currentTime /= duration) == 1) {
                return 0;
            }

            return Math.floor(amplitude * Math.pow(2, -10 * currentTime) * Math.sin((currentTime * duration) * (2 * Math.PI) / period));
        }

        this.gameLoop.add('shake', shakeTheScreen);
        this.gameLoop.add('collisions', collisions);
        this.gameLoop.add('level', generateLevel);

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;


        var energyDrainSprite;
        var energyLoadSprite;

        function initEnergyRenderStuff() {
            energyDrainSprite = self.stage.getSprite('energy-drain-anim/energy_drain', 90, false);
            energyLoadSprite = self.stage.getSprite('energy-load-anim/energy_load', 90, false);
        }

        function drainEnergy() {
            function turnShieldsOn() {
                shieldsOn = true;
                self.stage.animate(shieldsDrawable, shieldsUpSprite, function () {
                    shieldsDrawable.img = self.stage.getSubImage("shield3");
                });
            }

            function startDraining() {
                var position = 0;
                if (self.stage.animations.has(energyBarDrawable)) {
                    position = 89 - self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time;
                }

                self.stage.animate(energyBarDrawable, energyDrainSprite, energyEmpty);

                self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time = position;
                energyBarDrawable.img = self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
            }

            turnShieldsOn();
            startDraining();
        }

        function energyEmpty() {
            function setEnergyBarEmpty() {
                energyBarDrawable.img = self.stage.getSubImage('energy_bar_empty');
            }

            turnShieldsOff();
            setEnergyBarEmpty();
        }

        function turnShieldsOff() {
            shieldsOn = false;
            self.stage.animate(shieldsDrawable, shieldsDownSprite, function () {
                self.stage.remove(shieldsDrawable);
            });
        }

        function loadEnergy() {
            function startLoading() {
                var position = 0;
                if (self.stage.animations.has(energyBarDrawable)) {
                    position = 89 - self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time;
                }
                self.stage.animate(energyBarDrawable, energyLoadSprite, energyFull);

                self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].time = position;
                energyBarDrawable.img = self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
            }

            if (shieldsOn) {
                turnShieldsOff();
            }
            startLoading();
        }

        function energyFull() {
            function setEnergyBarFull() {
                energyBarDrawable.img = self.stage.getSubImage('energy_bar_full');
            }

            setEnergyBarFull();
        }

        initEnergyRenderStuff();

        var touchable = {id: 'shields_up', x: 0, y: 0, width: 320, height: 480};
        this.gameController.add(touchable, drainEnergy, loadEnergy);

        //end scene todo move to own scene
        function endGame() {
            for (var key in lifeDrawablesDict) {
                if (lifeDrawablesDict.hasOwnProperty(key)) {
                    self.stage.remove(lifeDrawablesDict[key]);
                }
            }

            self.gameLoop.remove('shake');
            self.gameLoop.remove('collisions');
            self.gameLoop.remove('level');

            self.gameController.remove(touchable);

            var barOut = self.stage.getPath(energyBarDrawable.x, energyBarDrawable.y, energyBarDrawable.x, energyBarDrawable.y + 100, 60, Transition.EASE_OUT_EXPO);
            self.stage.move(energyBarDrawable, barOut, function () {
                self.stage.remove(energyBarDrawable);
            });

//            if (DEBUG_START_IMMEDIATELY) {
//                self.stage.remove(shipDrawable);
//                self.stage.remove(fireDrawable);
//                speedStripes.forEach(function (speedStripe) {
//                    self.stage.remove(speedStripe);
//                });
//                countDrawables.forEach(function (count) {
//                    self.stage.remove(count);
//                });
//                self._postGameScene(self.stage, points);
//            } else {
            self.next(nextScene, points);
//            }
        }

        function drawStar(stage, imgName, x, speed) {
            var star = stage.animateFresh(x, -108 / 2, imgName, 30);
            stage.move(star, stage.getPath(x, -108 / 2, x, 480 + 108 / 2, speed, Transition.LINEAR));

            return star;
        }

        function drawAsteroid(stage, imgName, x, speed) {
            return stage.moveFresh(x, -108 / 2, imgName, x, 480 + 108 / 2, speed, Transition.LINEAR);
        }

        function range(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    
    PlayGame.prototype.next = function (nextScene, points) {
        this.sceneStorage.points = points;

        nextScene();
    };

    return PlayGame;
})(Transition);