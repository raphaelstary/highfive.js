var PlayGame = (function (Transition, ScreenShaker, LevelGenerator, Odometer, CollectView, ObstaclesView) {
    "use strict";

    function PlayGame(stage, sceneStorage, gameLoop, gameController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
    }
    
    PlayGame.prototype.show = function (nextScene) {
        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields || this.stage.getDrawable(320 / 2, 400, 'shields'),
            energyBarDrawable = this.sceneStorage.energyBar,
            lifeDrawablesDict = this.sceneStorage.lives,
            countDrawables = this.sceneStorage.counts,
            fireDrawable = this.sceneStorage.fire,
            speedStripes = this.sceneStorage.speedStripes,
            shieldsUpSprite = this.sceneStorage.shieldsUp || this.stage.getSprite('shields-up-anim/shields_up', 6, false),
            shieldsDownSprite = this.sceneStorage.shieldsDown || this.stage.getSprite('shields-down-anim/shields_down', 6, false);

        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;
        delete this.sceneStorage.shieldsUp;
        delete this.sceneStorage.shieldsDown;

        var shaker = new ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1], lifeDrawablesDict[2],lifeDrawablesDict[3], fireDrawable]);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(shaker.add.bind(shaker));

        var shieldsOn = false; //part of global game state
        var lives = 3; //3; //part of global game state
        var initialLives = 3; // needed for right render stuff after collect or similar
        var points = 0; //part of global game state

        var scoreDisplay = new Odometer(this.stage, countDrawables);
        var collectAnimator = new CollectView(this.stage, shipDrawable, initialLives);

        var trackedAsteroids = {};
        var trackedStars = {};
        var self = this;

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
                    shaker.startSmallShake();

                    delete trackedAsteroids[key];
                    continue;
                }

                if (needPreciseCollisionDetection(asteroid) && isHit(asteroid)) {
                    self.stage.remove(asteroid);
                    delete trackedAsteroids[key];

                    shipGotHit();
                    shaker.startBigShake();

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
                    collectAnimator.collectStar(lives);
                    showScoredPoints(star.x, star.y);
                    var score = 10;
                    scoreDisplay.addScore(score);
                    points += score;

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

        var level = new LevelGenerator(new ObstaclesView(this.stage, trackedAsteroids, trackedStars));

        this.gameLoop.add('shake', shaker.update.bind(shaker));
        this.gameLoop.add('collisions', collisions);
        this.gameLoop.add('level', level.update.bind(level));

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

            self.next(nextScene, points);
        }




    };
    
    PlayGame.prototype.next = function (nextScene, points) {
        this.sceneStorage.points = points;

        nextScene();
    };

    return PlayGame;
})(Transition, ScreenShaker, LevelGenerator, Odometer, CollectView, ObstaclesView);