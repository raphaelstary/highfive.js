var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(drawHelper) {
        this.drawHelper = drawHelper;

        // level difficulty
        this.level = {
            maxTimeToFirst: 100,
            percentageForAsteroid: 66,

            asteroidSpeed: 90,
            pauseAfterAsteroid: 30,
            maxTimeToNextAfterAsteroid: 100,

            starSpeed: 90,
            pauseAfterStar: 20,
            maxTimeToNextAfterStar: 100
        };

        this.counter = 0;
        // elements fly with interval 0 - 100
        this.nextCount = range(0, this.level.maxTimeToFirst);
    }

    LevelGenerator.prototype.update = function () {
        this.counter += 1;
        if (this.counter <= this.nextCount) {
            return;
        }

        this.counter = 0;

        // 2/3 asteroid, 1/3 star
        if (range(1, 100) <= this.level.percentageForAsteroid) {
            this.drawHelper.drawRandomAsteroid(this.level.asteroidSpeed);
            this.nextCount = this.level.pauseAfterAsteroid + range(0, this.level.maxTimeToNextAfterAsteroid);
        } else {
            this.drawHelper.drawRandomStar(this.level.starSpeed);
            this.nextCount = this.level.pauseAfterStar + range(0, this.level.maxTimeToNextAfterStar);
        }
    };

    return LevelGenerator;
})(range);