var ObstaclesView = (function (Transition, range, calcScreenConst, changeCoords, changePath) {
    "use strict";

    function ObstaclesView(stage, trackedAsteroids, trackedStars, resizeRepo, screenWidth, screenHeight) {
        this.stage = stage;

        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;

        this.resizeRepo = resizeRepo;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    ObstaclesView.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        this.resizeRepo.call();
    };

    ObstaclesView.prototype.drawStar = function (imgName, x, speed, relativePosition) {
        var starHeightHalf = calcScreenConst(this.stage.getSubImage('star1-anim/star1_0000').height, 2);
        var responsiveTimeUnit = calcScreenConst(this.screenHeight, 480);

        var star = this.stage.animateFresh(x, - starHeightHalf, imgName, 30);
        var path = this.stage.getPath(x, -starHeightHalf, x, this.screenHeight + starHeightHalf,
            speed * responsiveTimeUnit, Transition.LINEAR);

        this.stage.move(star, path);
        this.trackedStars[star.id] = star;

        if (relativePosition) {
            var self = this;
            self.resizeRepo.add(star, function () {
                var startRange = self._getStarStartRange();
                var newX = Math.floor((self._getStarEndRange(startRange) - startRange) / 100 * relativePosition + startRange);
                changeCoords(star, newX,- starHeightHalf);
                changePath(path, newX, -starHeightHalf, newX, self.screenHeight + starHeightHalf);
                path.duration = speed * calcScreenConst(self.screenHeight, 480)
            });
        }
        return star;
    };

    ObstaclesView.prototype._getStarStartRange = function () {
        var singleStarWidth = this.stage.getSubImage('star1-anim/star1_0000').width;
        var shipWidth = this.stage.getSubImage('ship').width;

        return calcScreenConst(this.screenWidth + shipWidth, 2) - singleStarWidth;
    };

    ObstaclesView.prototype._getStarEndRange = function (startRange) {
        return this.screenWidth - startRange;
    };

    ObstaclesView.prototype.drawRandomStar = function (speed) {
        var starNum = range(1, 4);
        var starPath = 'star' + starNum + '-anim/star' + starNum;

        var startRange = this._getStarStartRange();
        var endRange = this._getStarEndRange(startRange);

        var x = range(startRange, endRange);

        var relativePosition = (x - startRange) / ((endRange - startRange) / 100);

        return this.drawStar(starPath, x, speed, relativePosition);
    };

    ObstaclesView.prototype.drawAsteroid = function (imgName, x, speed, relativePosition) {
        var asteroidHeightHalf = calcScreenConst(this.stage.getSubImage(imgName).height, 2);
        var responsiveTimeUnit = calcScreenConst(this.screenHeight, 480);

        var asteroid = this.stage.moveFresh(x, - asteroidHeightHalf, imgName, x, this.screenHeight + asteroidHeightHalf,
            speed * responsiveTimeUnit, Transition.LINEAR);
        this.trackedAsteroids[asteroid.drawable.id] = asteroid.drawable;

        if (relativePosition) {
            var self = this;
            this.resizeRepo.add(asteroid.drawable, function () {
                var startRange = self._getAsteroidStartRange(imgName);
                var newX = Math.floor((self._getAsteroidEndRange(startRange) - startRange) / 100 * relativePosition + startRange);
                changeCoords(asteroid.drawable, newX, - asteroidHeightHalf);
                changePath(asteroid.path, newX, - asteroidHeightHalf, newX, self.screenHeight + asteroidHeightHalf);
                asteroid.path.duration = calcScreenConst(self.screenHeight, 480) * speed;
            });
        }

        return asteroid.drawable;
    };

    ObstaclesView.prototype.drawRandomAsteroid = function (speed) {
        var asteroidPath = 'asteroid' + range(1, 4);

        var startRange = this._getAsteroidStartRange(asteroidPath);
        var endRange = this._getAsteroidEndRange(startRange);
        var x = range(startRange, endRange);
        var relativePosition = (x - startRange) / ((endRange - startRange) / 100);

        return this.drawAsteroid(asteroidPath, x, speed, relativePosition);
    };

    ObstaclesView.prototype._getAsteroidStartRange = function (asteroidPath) {
        var asteroidWidth = this.stage.getSubImage(asteroidPath).width;
        var shipWidth = this.stage.getSubImage('ship').width;

        return calcScreenConst(this.screenWidth + shipWidth, 2) - asteroidWidth;
    };

    ObstaclesView.prototype._getAsteroidEndRange = function (startRange) {
        return this.screenWidth - startRange;
    };

    return ObstaclesView;
})(Transition, range, calcScreenConst, changeCoords, changePath);