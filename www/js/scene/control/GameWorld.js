var GameWorld = (function () {
    "use strict";

    function GameWorld(stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator, shipCollision,
                       shieldsCollision, shipDrawable, shieldsDrawable, screenShaker, lifeDrawablesDict, endGame) {
        this.stage = stage;
        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;

        this.scoreDisplay = scoreDisplay;
        this.collectAnimator = collectAnimator;
        this.scoreAnimator = scoreAnimator;

        this.shipCollision = shipCollision;
        this.shieldsCollision = shieldsCollision;

        this.shipDrawable = shipDrawable;
        this.shieldsDrawable = shieldsDrawable;

        this.shaker = screenShaker;
        this.lifeDrawablesDict = lifeDrawablesDict;
        this.endGame = endGame;

        this.shieldsOn = false; //part of global game state
        this.lives = 3; //3; //part of global game state
        this.initialLives = this.lives;
        this.points = 0; //part of global game state

        this.shieldsGetHitSprite = stage.getSprite('shiels-hit-anim/shields_hit', 10, false); //TODO change sprite name
        this.elemHitsShieldsSprite = stage.getSprite('shield-hit-anim/shield_hit', 12, false);

        this.shipHullHitSprite = stage.getSprite('ship-hit-anim/ship_hit', 30, false);
        this.dumpLifeSprite = stage.getSprite('lost-life-anim/lost_life', 20, false);
    }

    GameWorld.prototype.checkCollisions = function () {
        var self = this;
        var key;
        for (key in this.trackedAsteroids) {
            if (!this.trackedAsteroids.hasOwnProperty(key)) {
                continue;
            }
            var asteroid = this.trackedAsteroids[key];

            if (this.shieldsOn && needPreciseCollisionDetection(this.shieldsDrawable, asteroid) &&
                this.shieldsCollision.isHit(asteroid)) {

                this.stage.animate(this.shieldsDrawable, this.shieldsGetHitSprite, function () {
                    if (self.shieldsOn) {
                        self.shieldsDrawable.img = self.stage.getSubImage('shield3');
                    } else {
                        self.stage.remove(self.shieldsDrawable);
                    }
                });
                (function (asteroid) {
                    self.stage.remove(asteroid);
                    self.stage.animate(asteroid, self.elemHitsShieldsSprite, function () {
                        self.stage.remove(asteroid);
                    })
                })(asteroid);
                this.shaker.startSmallShake();

                delete this.trackedAsteroids[key];
                continue;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, asteroid) && this.shipCollision.isHit(asteroid)) {
                this.stage.remove(asteroid);
                delete this.trackedAsteroids[key];

                this._shipGotHit();
                this.shaker.startBigShake();

                if (this.lives <= 0) {
                    this.endGame(this.points);
                }
//                    continue;
            }
        }

        for (key in this.trackedStars) {
            if (!this.trackedStars.hasOwnProperty(key)) {
                continue;
            }
            var star = this.trackedStars[key];

            if (this.shieldsOn && needPreciseCollisionDetection(this.shieldsDrawable, star) &&
                this.shieldsCollision.isHit(star)) {
                self.stage.animate(this.shieldsDrawable, this.shieldsGetHitSprite, function () {
                    if (self.shieldsOn) {
                        self.shieldsDrawable.img = self.stage.getSubImage('shield3');
                    } else {
                        self.stage.remove(self.shieldsDrawable);
                    }
                });
                (function (star) {
                    self.stage.remove(star);
                    self.stage.animate(star, self.elemHitsShieldsSprite, function () {
                        self.stage.remove(star);
                    })
                })(star);

                delete this.trackedStars[key];
                continue;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, star) && this.shipCollision.isHit(star)) {
                this.collectAnimator.collectStar(this.lives);
                this.scoreAnimator.showScoredPoints(star.x, star.y);
                var score = 10;
                this.scoreDisplay.addScore(score);
                this.points += score;

                this.stage.remove(star);
                delete this.trackedStars[key];
//                    continue;
            }
        }
    };

    GameWorld.prototype._shipGotHit = function () {
        var self = this;
        var currentLife = this.lives;
        self.stage.animate(this.lifeDrawablesDict[currentLife], this.dumpLifeSprite, function () {
            self.stage.remove(self.lifeDrawablesDict[currentLife]);
            delete self.lifeDrawablesDict[currentLife];
        });

        if (--this.lives > 0) {
            self.stage.animate(this.shipDrawable, this.shipHullHitSprite, function () {
                if (self.lives == self.initialLives - 1) {
                    self.shipDrawable.img = self.stage.getSubImage('damaged-ship2');
                } else if (self.lives == self.initialLives - 2) {
                    self.shipDrawable.img = self.stage.getSubImage('damaged-ship3');
                } else {
                    self.shipDrawable.img = self.stage.getSubImage('ship');
                }
            });
        }
    };

    function needPreciseCollisionDetection(stationaryObject, movingObstacle) {
        return stationaryObject.getCornerY() <= movingObstacle.getEndY();
    }

    return GameWorld;
})();