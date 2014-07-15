var FlyingObstaclesDrawHelper = (function (Transition, range) {
    "use strict";

    function FlyingObstaclesDrawHelper(stage, trackedAsteroids, trackedStars) {
        this.stage = stage;

        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;
    }

    FlyingObstaclesDrawHelper.prototype.drawStar = function (imgName, x, speed) {
        var star = this.stage.animateFresh(x, -108 / 2, imgName, 30);
        this.stage.move(star, this.stage.getPath(x, -108 / 2, x, 480 + 108 / 2, speed, Transition.LINEAR));

        return star;
    };

    FlyingObstaclesDrawHelper.prototype.drawRandomStar = function (speed) {
        var starNum = range(1, 4);
        var starPath = 'star' + starNum + '-anim/star' + starNum;
        var drawable = this.drawStar(starPath, range(320 / 3, 2 * 320 / 3), speed);

        this.trackedStars[drawable.id] = drawable;
    };

    FlyingObstaclesDrawHelper.prototype.drawAsteroid = function (imgName, x, speed) {
        return this.stage.moveFresh(x, -108 / 2, imgName, x, 480 + 108 / 2, speed, Transition.LINEAR);
    };

    FlyingObstaclesDrawHelper.prototype.drawRandomAsteroid = function (speed) {
        var asteroidPath = 'asteroid' + range(1, 4);
        var drawable = this.drawAsteroid(asteroidPath, range(320 / 5, 4 * 320 / 5), speed);

        this.trackedAsteroids[drawable.id] = drawable;
    };

    return FlyingObstaclesDrawHelper;
})(Transition, range);