var InGameTutorial = (function (require) {
    "use strict";

    function InGameTutorial(stage, sceneStorage, gameLoop, gameController, messages, tapController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
        this.messages = messages;
        this.tapController = tapController;
    }

    InGameTutorial.prototype.show = function (nextScene) {
        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields || this.stage.getDrawable(320 / 2, 400, 'shields'),
            energyBarDrawable = this.sceneStorage.energyBar,
            lifeDrawablesDict = this.sceneStorage.lives,
            countDrawables = this.sceneStorage.counts,
            fireDrawable = this.sceneStorage.fire,
            speedStripes = this.sceneStorage.speedStripes,
            shieldsUpSprite =
                this.sceneStorage.shieldsUp || this.stage.getSprite('shields-up-anim/shields_up', 6, false),
            shieldsDownSprite =
                this.sceneStorage.shieldsDown || this.stage.getSprite('shields-down-anim/shields_down', 6, false);

        var shaker = new require.ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1],
            lifeDrawablesDict[2], lifeDrawablesDict[3], fireDrawable]);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(shaker.add.bind(shaker));

        var self = this;
        var KEN_PIXEL = 'KenPixel';
        var white = '#fff';

        var trackedAsteroids = {};
        var trackedStars = {};

        var scoreDisplay = new require.Odometer(new require.OdometerView(this.stage, countDrawables));
        var collectAnimator = new require.CollectView(this.stage, shipDrawable, 3);
        var scoreAnimator = new require.ScoreView(this.stage);
        var shipCollision = new require.CanvasCollisionDetector(this.stage.renderer.atlas,
            this.stage.getSubImage('ship'), shipDrawable);
        var shieldsCollision = new require.CanvasCollisionDetector(this.stage.renderer.atlas,
            this.stage.getSubImage('shield3'), shieldsDrawable);

        var world = new require.GameWorld(this.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
            scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict,
            endGame);

        this.gameLoop.add('shake_tutorial', shaker.update.bind(shaker));
        this.gameLoop.add('collisions_tutorial', world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = new require.EnergyStateMachine(this.stage, world, shieldsDrawable, shieldsUpSprite,
            shieldsDownSprite, energyBarDrawable);

        var touchable = {id: 'shields_up', x: 0, y: 0, width: 320, height: 480};
        this.gameController.add(touchable,
            energyStates.drainEnergy.bind(energyStates), energyStates.loadEnergy.bind(energyStates));

        function removeEveryThing() {
            removeSkipStuff();
            removeTouchNHoldStuff();
            removeEnergyStuff();
            removeStarStuff();
        }

        var skipTxt, skipTouchable;
        function createSkipStuff() {
            var topRaster = 480 / 100 * 15;
            var x = 320 / 8 * 6;
            var y = topRaster;
            skipTouchable = {id: 'skip_tap', x: 320 / 2, y: y - (480 / 16),
                width: 320 / 2, height: 480 / 8};
            self.tapController.add(skipTouchable, function () {
                skipTxt.txt.alpha = 1;
                require.window.setTimeout(function () {
                    removeEveryThing();
                    self.next(nextScene);
                }, 1000);
            });
            skipTxt = self.stage.getDrawableText(x, y, 3,
                self.messages.get('tutorial', 'skip'), 15, 'KenPixel', '#fff', 0, 0.5);
            self.stage.draw(skipTxt);

            return skipTxt;
        }
        function removeSkipStuff() {
            self.stage.remove(skipTxt);
            self.tapController.remove(skipTouchable);
        }
        createSkipStuff();

        function createFirstAsteroid() {
            var asteroidName = 'asteroid1';
            var asteroid = self.stage.getDrawable(320 / 3, -108 / 2, asteroidName);
            trackedAsteroids[asteroid.id] = asteroid;
            self.stage.draw(asteroid);
            return asteroid;
        }
        function createTouchNHoldTxt() {
            var touch_txt = self.stage.getDrawableText(320 / 4 * 3, 480 / 3, 3,
                self.messages.get('tutorial', 'touch_and_hold'), 20, KEN_PIXEL, white, Math.PI / 16, 1, 320 / 3 * 2,
                25);
            self.stage.draw(touch_txt);
            var raise_txt = self.stage.getDrawableText(320 / 16 * 3, 480 / 2, 3,
                self.messages.get('tutorial', 'to_raise_shields'), 17, KEN_PIXEL, white, -Math.PI / 16, 1, 320 / 3, 22);
            self.stage.draw(raise_txt);

            return [touch_txt, raise_txt];
        }

        function moveMyFirstAsteroids() {
            if (asteroid.y < 480 / 4) {
                asteroid.y += 4;
            } else if (world.shieldsOn) {
                asteroid.y += 2;
            } else if (asteroid.y > 480 / 4) {
                asteroid.y -= 2;
            }
            if (!self.stage.has(asteroid)) {
                removeTouchNHoldStuff();
                showEnergyTxtSubScene();
            }
        }

        var touchTxts = createTouchNHoldTxt();
        var asteroid = createFirstAsteroid();
        self.gameLoop.add('asteroid_movement', moveMyFirstAsteroids);

        function removeTouchNHoldStuff() {
            if (touchTxts)
                touchTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove('asteroid_movement');
            if (asteroid)
                self.stage.remove(asteroid); //double remove just in case
        }

        var drainTxt, shieldsEnergyDrawable, energyTxt, okButton, okTouchable;
        function showEnergyTxtSubScene() {
            function createEnergyTxt() {
                drainTxt = self.stage.getDrawableText(320 / 2, 480 / 4, 3,
                    self.messages.get('tutorial', 'drain_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(drainTxt);
                shieldsEnergyDrawable = self.stage.animateFresh(320 / 2, 480 / 4 + 70, 'shields_energy-anim/shields_energy',
                    60);
                energyTxt = self.stage.getDrawableText(320 / 2, 480 / 2 + 25, 3,
                    self.messages.get('tutorial', 'no_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(energyTxt);
                okButton = self.stage.drawFresh(320 / 2, 480 / 3 * 2, 'ok');
                okTouchable = {id: 'ok_tap', x: okButton.getCornerX(), y: okButton.getCornerY(),
                    width: okButton.getWidth(), height: okButton.getHeight()};

                self.tapController.add(okTouchable, function () {
                    self.tapController.remove(okTouchable);
                    okButton.img = self.stage.getSubImage('ok-active');
                    require.window.setTimeout(function () {
                        removeEnergyStuff();
                        collectStarsSubScene();
                    }, 1500);
                });
            }

            createEnergyTxt();
        }

        function removeEnergyStuff() {
            if (drainTxt)
                self.stage.remove(drainTxt);
            if (shieldsEnergyDrawable)
                self.stage.remove(shieldsEnergyDrawable);
            if (energyTxt)
                self.stage.remove(energyTxt);
            if (okButton)
                self.stage.remove(okButton);
            if (okTouchable)
                self.tapController.remove(okTouchable);
        }

        var starTxts, star;
        function collectStarsSubScene() {
            function createFirstStar() {
                var starNum = range(1, 4);
                var starPath = 'star' + starNum + '-anim/star' + starNum;
                var star = self.stage.animateFresh(320 / 3, -108 / 2, starPath, 30);
                trackedStars[star.id] = star;
                self.stage.draw(star);

                return star;
            }
            function createCollectTxt() {
                var collectTxt = self.stage.getDrawableText(320 / 4 * 3, 480 / 3, 3,
                    self.messages.get('tutorial', 'collect_stuff'), 20, KEN_PIXEL, white, Math.PI / 16, 1, 320 / 2,
                    25);
                self.stage.draw(collectTxt);

                return [collectTxt];
            }

            function moveMyFirstStar() {
                if (star.y < 480 / 4) {
                    star.y += 4;
                } else if (!world.shieldsOn) {
                    star.y += 1;
                } else if (star.y > 480 / 4) {
                    star.y -= 2;
                }
                if (world.points < 1 && !self.stage.has(star)) {
                    star = createFirstStar();
                }
                if (!self.stage.has(star)) {
                    removeStarStuff();
                    removeSkipStuff();
                    endGame();
                }
            }

            starTxts = createCollectTxt();
            star = createFirstStar();
            self.gameLoop.add('star_movement', moveMyFirstStar);
        }

        function removeStarStuff() {
            if (starTxts)
                starTxts.forEach(self.stage.remove.bind(self.stage));
            self.gameLoop.remove('star_movement');
        }

        //end scene todo move to own scene
        function endGame() {

            self.gameLoop.remove('shake_tutorial');
            self.gameLoop.remove('collisions_tutorial');

            self.gameController.remove(touchable);

            self.next(nextScene);
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        nextScene();
    };

    return InGameTutorial;
})({
    Transition: Transition,
    ScreenShaker: ScreenShaker,
    Odometer: Odometer,
    CollectView: CollectView,
    ObstaclesView: ObstaclesView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    CanvasCollisionDetector: CanvasCollisionDetector,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    window: window
});