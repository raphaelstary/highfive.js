var LevelGenerator = (function () {
    "use strict";

    function LevelGenerator(stage) {
        this.stage = stage;

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
        // im interval 0 - 100 kommt ein element
        this.nextCount = range(0, this.level.maxTimeToFirst);
    }

    LevelGenerator.prototype.update = function () {
        this.counter += 1;
        if (this.counter <= this.nextCount) {
            return;
        }

        this.counter = 0;

        var drawable;
        // 2/3 asteroid, 1/3 star
        if (range(1, 100) <= this.level.percentageForAsteroid) {
            drawable = drawAsteroid(this.stage, 'asteroid' + range(1, 4), range(320 / 5, 4 * 320 / 5), this.level.asteroidSpeed);
            this.nextCount = this.level.pauseAfterAsteroid + range(0, this.level.maxTimeToNextAfterAsteroid);

            trackedAsteroids[drawable.id] = drawable;
        } else {
            var starNum = range(1, 4);
            var starPath = 'star' + starNum + '-anim/star' + starNum;
            drawable = drawStar(this.stage, starPath, range(320 / 3, 2 * 320 / 3), this.level.starSpeed);
            this.nextCount = this.level.pauseAfterStar + range(0, this.level.maxTimeToNextAfterStar);

            trackedStars[drawable.id] = drawable;
        }
    };

    function range(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function drawStar(stage, imgName, x, speed) {
        var star = stage.animateFresh(x, -108 / 2, imgName, 30);
        stage.move(star, stage.getPath(x, -108 / 2, x, 480 + 108 / 2, speed, Transition.LINEAR));

        return star;
    }

    function drawAsteroid(stage, imgName, x, speed) {
        return stage.moveFresh(x, -108 / 2, imgName, x, 480 + 108 / 2, speed, Transition.LINEAR);
    }

    return LevelGenerator;
})();