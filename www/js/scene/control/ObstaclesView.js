var ObstaclesView = (function (Transition, range, calcScreenConst) {
    "use strict";

    function ObstaclesView(stage, trackedAsteroids, trackedStars, screenWidth, screenHeight) {
        this.stage = stage;

        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    ObstaclesView.prototype.drawStar = function (imgName, x, speed) {
        var starHeightHalf = calcScreenConst(this.stage.getSubImage('star1-anim/star1_0000').height, 2);
        var responsiveTimeUnit = calcScreenConst(this.screenHeight, 480);

        var star = this.stage.animateFresh(x, - starHeightHalf, imgName, 30);
        this.stage.move(star, this.stage.getPath(x, - starHeightHalf, x, this.screenHeight + starHeightHalf,
            speed * responsiveTimeUnit, Transition.LINEAR));
        this.trackedStars[star.id] = star;

        return star;
    };

    ObstaclesView.prototype.drawRandomStar = function (speed) {
        var starNum = range(1, 4);
        var starPath = 'star' + starNum + '-anim/star' + starNum;

        var singleStarWidth = this.stage.getSubImage('star1-anim/star1_0000').width;
        var shipWidth = this.stage.getSubImage('ship').width;

        var startRange = calcScreenConst(this.screenWidth + shipWidth, 2) - singleStarWidth;
        var endRange = this.screenWidth - startRange;

        return this.drawStar(starPath, range(startRange, endRange), speed);
    };

    ObstaclesView.prototype.drawAsteroid = function (imgName, x, speed) {
        var asteroidHeightHalf = calcScreenConst(this.stage.getSubImage(imgName).height, 2);
        var responsiveTimeUnit = calcScreenConst(this.screenHeight, 480);

        var asteroid = this.stage.moveFresh(x, - asteroidHeightHalf, imgName, x, this.screenHeight + asteroidHeightHalf,
            speed * responsiveTimeUnit, Transition.LINEAR).drawable;
        this.trackedAsteroids[asteroid.id] = asteroid;

        return asteroid;
    };

    ObstaclesView.prototype.drawRandomAsteroid = function (speed) {
        var asteroidPath = 'asteroid' + range(1, 4);

        var asteroidWidth = this.stage.getSubImage(asteroidPath).width;
        var shipWidth = this.stage.getSubImage('ship').width;

        var startRange = calcScreenConst(this.screenWidth + shipWidth, 2) - asteroidWidth;
        var endRange = this.screenWidth - startRange;

        return this.drawAsteroid(asteroidPath, range(startRange, endRange), speed);
    };

    return ObstaclesView;
})(Transition, range, calcScreenConst);