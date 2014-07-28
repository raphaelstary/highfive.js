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

    InGameTutorial.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var widthHalf = require.calcScreenConst(screenWidth, 2),
            widthThird = require.calcScreenConst(screenWidth, 3),
            widthThreeQuarter = require.calcScreenConst(screenWidth, 4, 3),
            widthEighth = require.calcScreenConst(screenWidth, 8);

        var __400 = require.calcScreenConst(screenHeight, 6, 5);

        var heightHalf = require.calcScreenConst(screenHeight, 2),
            heightThird = require.calcScreenConst(screenHeight, 3),
            heightQuarter = require.calcScreenConst(screenHeight, 4),
            heightSixteenth = require.calcScreenConst(screenHeight, 16);

        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields || this.stage.getDrawable(widthHalf, __400, 'shields'),
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
        var scoreAnimator = new require.ScoreView(this.stage, screenWidth, screenHeight);
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

        var touchable = {id: 'shields_up_tutorial', x: 0, y: 0, width: screenWidth, height: screenHeight};

        registerGameController();

        function removeEveryThing() {
            removeSkipStuff();
            removeTouchNHoldStuff();
            removeEnergyStuff();
            removeStarStuff();
            removeCommonGameLoopStuff();
            unregisterGameController();
        }

        var skipTxt, skipTouchable;
        function createSkipStuff() {
            var topRaster = require.calcScreenConst(screenHeight, 20, 3);
            var x = widthEighth * 6;
            var y = topRaster;
            skipTouchable = {id: 'skip_tap', x: widthHalf, y: y - heightSixteenth,
                width: widthHalf, height: require.calcScreenConst(screenHeight, 8)};
            self.tapController.add(skipTouchable, function () {
                skipTxt.txt.alpha = 1;
                require.window.setTimeout(function () {
                    removeEveryThing();
                    endGame();
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
            var asteroidHeightHalf = require.calcScreenConst(self.stage.getSubImage(asteroidName).height, 2);
            var asteroidWidthHalf = require.calcScreenConst(self.stage.getSubImage(asteroidName).width, 2);
            var asteroid = self.stage.getDrawable(widthHalf - asteroidWidthHalf, - asteroidHeightHalf, asteroidName);
            trackedAsteroids[asteroid.id] = asteroid;
            self.stage.draw(asteroid);
            return asteroid;
        }
        function createTouchNHoldTxt() {

            var touch_txt = self.stage.getDrawableText(widthThreeQuarter, heightThird, 3,
                self.messages.get('tutorial', 'touch_and_hold'), 20, KEN_PIXEL, white, Math.PI / 16, 1, widthThird * 2,
                25);
            self.stage.draw(touch_txt);

            var raise_txt = self.stage.getDrawableText(require.calcScreenConst(screenWidth, 16, 3), heightHalf, 3,
                self.messages.get('tutorial', 'to_raise_shields'), 17, KEN_PIXEL, white, - Math.PI / 16, 1, widthThird,
                22);
            self.stage.draw(raise_txt);

            return [touch_txt, raise_txt];
        }

        var __4 = require.calcScreenConst(screenHeight, 100);
        var __2 = require.calcScreenConst(screenHeight, 200);
        var __1 = require.calcScreenConst(screenHeight, 400);
        function moveMyFirstAsteroids() {
            if (asteroid.y < heightQuarter) {
                asteroid.y += __4;
            } else if (world.shieldsOn) {
                asteroid.y += __2;
            } else if (asteroid.y > heightQuarter) {
                asteroid.y -= __2;
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

        var drainTxt, shieldsEnergyDrawable, energyTxt, okButton, okTouchable, dialogBack;
        function showEnergyTxtSubScene() {
            function createEnergyTxt() {
                dialogBack = self.stage.drawFresh(widthHalf, heightHalf, 'background', 3);
                drainTxt = self.stage.getDrawableText(widthHalf, heightThird, 3,
                    self.messages.get('tutorial', 'drain_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(drainTxt);
                shieldsEnergyDrawable = self.stage.animateFresh(widthHalf, heightHalf,
                    'shields_energy-anim/shields_energy', 60);
                energyTxt = self.stage.getDrawableText(widthHalf, heightThird * 2, 3,
                    self.messages.get('tutorial', 'no_energy'), 15, KEN_PIXEL, white);
                self.stage.draw(energyTxt);
                okButton = self.stage.drawFresh(widthHalf, heightSixteenth * 13, 'ok');
                okTouchable = {id: 'ok_tap', x: okButton.getCornerX(), y: okButton.getCornerY(),
                    width: okButton.getWidth(), height: okButton.getHeight()};

                self.tapController.add(okTouchable, function () {
                    self.tapController.remove(okTouchable);
                    okButton.img = self.stage.getSubImage('ok-active');
                    require.window.setTimeout(function () {
                        removeEnergyStuff();
                        registerGameController();
                        collectStarsSubScene();
                    }, 1500);
                });
            }
            unregisterGameController();
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
            if (dialogBack)
                self.stage.remove(dialogBack);
        }

        var starTxts, star;
        function collectStarsSubScene() {
            function createFirstStar() {
                var starNum = require.range(1, 4);
                var starPath = 'star' + starNum + '-anim/star' + starNum;
                var starHeightHalf = require.calcScreenConst(self.stage.getSubImage('star1-anim/star1_0000').height, 2);
                var starWidthHalf = require.calcScreenConst(self.stage.getSubImage('star1-anim/star1_0000').height, 2);
                var star = self.stage.animateFresh(widthHalf - starWidthHalf, - starHeightHalf, starPath, 30);
                trackedStars[star.id] = star;
                self.stage.draw(star);

                return star;
            }
            function createCollectTxt() {
                var collectTxt = self.stage.getDrawableText(widthThreeQuarter, heightThird, 3,
                    self.messages.get('tutorial', 'collect_stuff'), 20, KEN_PIXEL, white, Math.PI / 16, 1, widthHalf,
                    25);
                self.stage.draw(collectTxt);

                return [collectTxt];
            }

            function moveMyFirstStar() {
                if (star.y < heightQuarter) {
                    star.y += __4;
                } else if (!world.shieldsOn) {
                    star.y += __1;
                } else if (star.y > heightQuarter) {
                    star.y -= __2;
                }
                if (world.points < 1 && !self.stage.has(star)) {
                    star = createFirstStar();
                }
                if (!self.stage.has(star)) {
                    removeEveryThing();
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
            if (star)
                self.stage.remove(star);
        }

        function registerGameController() {
            self.gameController.add(touchable, energyStates.drainEnergy.bind(energyStates),
                energyStates.loadEnergy.bind(energyStates));
        }

        function unregisterGameController() {
            if (touchable)
                self.gameController.remove(touchable);
        }

        function removeCommonGameLoopStuff() {
            self.gameLoop.remove('shake_tutorial');
            self.gameLoop.remove('collisions_tutorial');
        }

        function endGame() {
            self.next(nextScene);
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        nextScene();
    };

    return InGameTutorial;
})({
    ScreenShaker: ScreenShaker,
    Odometer: Odometer,
    CollectView: CollectView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    CanvasCollisionDetector: CanvasCollisionDetector,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    window: window,
    range: range,
    calcScreenConst: calcScreenConst
});