var PlayGame = (function (Transition, ScreenShaker, LevelGenerator, Odometer, CollectView, ObstaclesView, OdometerView, ScoreView, CanvasCollisionDetector, GameWorld) {
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
            shieldsUpSprite =
                this.sceneStorage.shieldsUp || this.stage.getSprite('shields-up-anim/shields_up', 6, false),
            shieldsDownSprite =
                this.sceneStorage.shieldsDown || this.stage.getSprite('shields-down-anim/shields_down', 6, false);

        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;
        delete this.sceneStorage.shieldsUp;
        delete this.sceneStorage.shieldsDown;

        var shaker = new ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1],
            lifeDrawablesDict[2],lifeDrawablesDict[3], fireDrawable]);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(shaker.add.bind(shaker));

        var self = this;

        var trackedAsteroids = {};
        var trackedStars = {};

        var level = new LevelGenerator(new ObstaclesView(this.stage, trackedAsteroids, trackedStars));

        var scoreDisplay = new Odometer(new OdometerView(this.stage, countDrawables));
        var collectAnimator = new CollectView(this.stage, shipDrawable, 3);
        var scoreAnimator = new ScoreView(this.stage);
        var shipCollision =
            new CanvasCollisionDetector(this.stage.renderer.atlas, this.stage.getSubImage('ship'), shipDrawable);
        var shieldsCollision =
            new CanvasCollisionDetector(this.stage.renderer.atlas, this.stage.getSubImage('shield3'), shieldsDrawable);

        var world = new GameWorld(this.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
            scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict, endGame);

        this.gameLoop.add('shake', shaker.update.bind(shaker));
        this.gameLoop.add('collisions', world.checkCollisions.bind(world));
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
                world.shieldsOn = true;
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
                energyBarDrawable.img =
                    self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
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
            world.shieldsOn = false;
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
                energyBarDrawable.img =
                    self.stage.animations.animationStudio.animationsDict[energyBarDrawable.id].sprite.frames[position];
            }

            if (world.shieldsOn) {
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
        function endGame(points) {
            for (var key in lifeDrawablesDict) {
                if (lifeDrawablesDict.hasOwnProperty(key)) {
                    self.stage.remove(lifeDrawablesDict[key]);
                }
            }

            self.gameLoop.remove('shake');
            self.gameLoop.remove('collisions');
            self.gameLoop.remove('level');

            self.gameController.remove(touchable);

            var barOut = self.stage.getPath(energyBarDrawable.x, energyBarDrawable.y,
                    energyBarDrawable.x, energyBarDrawable.y + 100, 60, Transition.EASE_OUT_EXPO);

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
})(Transition, ScreenShaker, LevelGenerator, Odometer, CollectView, ObstaclesView, OdometerView, ScoreView,
    CanvasCollisionDetector, GameWorld);