var PlayGame = (function (require) {
    "use strict";

    function PlayGame(stage, sceneStorage, gameLoop, gameController) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
    }

    PlayGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var shipDrawable = this.sceneStorage.ship,
            shieldsDrawable = this.sceneStorage.shields ||
                this.stage.getDrawable(require.calcScreenConst(screenWidth, 2), 400, 'shields'),
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

        var shaker = new require.ScreenShaker([shipDrawable, shieldsDrawable, energyBarDrawable, lifeDrawablesDict[1],
            lifeDrawablesDict[2], lifeDrawablesDict[3], fireDrawable]);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(shaker.add.bind(shaker));

        var self = this;

        var trackedAsteroids = {};
        var trackedStars = {};

        var level = new require.LevelGenerator(new require.ObstaclesView(this.stage, trackedAsteroids, trackedStars,
            screenWidth, screenHeight));

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

        this.gameLoop.add('shake', shaker.update.bind(shaker));
        this.gameLoop.add('collisions', world.checkCollisions.bind(world));
        this.gameLoop.add('level', level.update.bind(level));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = new require.EnergyStateMachine(this.stage, world, shieldsDrawable, shieldsUpSprite,
            shieldsDownSprite, energyBarDrawable);

        var touchable = {id: 'shields_up', x: 0, y: 0, width: screenWidth, height: screenHeight};
        this.gameController.add(touchable,
            energyStates.drainEnergy.bind(energyStates), energyStates.loadEnergy.bind(energyStates));

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
            var outOffSet = require.calcScreenConst(screenWidth, 3);
            var barOut = self.stage.getPath(energyBarDrawable.x, energyBarDrawable.y,
                energyBarDrawable.x, energyBarDrawable.y + outOffSet, 60, require.Transition.EASE_OUT_EXPO);

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
})({
    Transition: Transition,
    ScreenShaker: ScreenShaker,
    LevelGenerator: LevelGenerator,
    Odometer: Odometer,
    CollectView: CollectView,
    ObstaclesView: ObstaclesView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    CanvasCollisionDetector: CanvasCollisionDetector,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    calcScreenConst: calcScreenConst
});