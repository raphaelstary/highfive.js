var GameWorld = (function () {
    "use strict";

    function GameWorld(stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator, shipCollision,
                       shieldsCollision, shipDrawable, shieldsDrawable, screenShaker, lifeDrawablesDict, removeFromRepo,
                       endGame, sounds) {
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
        this.removeFromRepo = removeFromRepo;
        this.endGame = endGame;

        this.sounds = sounds;

        this.shieldsOn = false; //part of global game state
        this.lives = 3; //3; //part of global game state
        this.initialLives = this.lives;
        this.points = 0; //part of global game state

        this.shieldsGetHitSprite = stage.getSprite('shields_hit/shields_hit', 15, false);
        this.elemHitsShieldsSprite = stage.getSprite('object_destroyed/object_destroyed', 3, false);

        this.shipHullHitSprite = stage.getSprite('hull_hit/hull_hit', 24, false);
        this.dumpLifeSprite = stage.getSprite('lost_life/lost_life', 20, false);
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
                        self.shieldsDrawable.img = self.stage.getSubImage('shields');
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
                this.sounds.play('asteroid-explosion');
                self.removeFromRepo(asteroid);
                delete this.trackedAsteroids[key];
                continue;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, asteroid) && this.shipCollision.isHit(asteroid)) {
                this.stage.remove(asteroid);
                self.removeFromRepo(asteroid);
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
                        self.shieldsDrawable.img = self.stage.getSubImage('shields');
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
                self.sounds.play('star-explosion');
                self.removeFromRepo(star);
                delete this.trackedStars[key];
                continue;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, star) && this.shipCollision.isHit(star)) {
                this.sounds.play('coin');
                this.collectAnimator.collectStar(this.lives);
                this.scoreAnimator.showScoredPoints(star.x, star.y);
                var score = 10;
                this.scoreDisplay.addScore(score);
                this.points += score;

                this.stage.remove(star);
                self.removeFromRepo(star);
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
            self.sounds.play('asteroid-explosion');
            self.stage.animate(this.shipDrawable, this.shipHullHitSprite, function () {
                if (self.lives == self.initialLives - 1) {
                    self.shipDrawable.img = self.stage.getSubImage('damaged_ship_2');
                } else if (self.lives == self.initialLives - 2) {
                    self.shipDrawable.img = self.stage.getSubImage('damaged_ship_3');
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