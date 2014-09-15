var LevelGenerator = (function () {
    "use strict";

    function LevelGenerator() {
        this.currentLevel = 6;

        var Level = {};

        Level[7] = {
            time: 60,
            people: ['baby', 'granny', 'cat'],
            fireFighters: [{speed: 3}]
        };

        Level[2] = {
            time: 60,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat'],
            fireFighters: [{speed: 3}]
        };

        Level[3] = {
            time: 30,
            people: ['cat', 'cat', 'cat'],
            bulkyWaste: ['lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan'],
            fireFighters: [{speed: 3}],
            percentageForPeople: 33
        };

        Level[4] = {
            time: 90,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat',
                'baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat',
                'baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat'],
            bulkyWaste: ['lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan'],
            fireFighters: [{speed: 3}],
            percentageForPeople: 50
        };

        Level[5] = {
            time: 60,
            people: ['cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat'],
            fireFighters: [{speed: 5}]
        };

        Level[6] = {
            time: 60,
            people: ['baby', 'baby', 'baby'],
            bulkyWaste: ['lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan'],
            fireFighters: [{speed: 2}, {speed: 5}, {speed: 7}],
            percentageForPeople: 33
        };

        Level[6] = {
            time: 90,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat',
                'baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat',
                'baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat'],
            bulkyWaste: ['lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan',
                'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan', 'lenovo', 'ipad', 'sultan'],
            fireFighters: [{speed: 2}, {speed: 5}, {speed: 7}],
            percentageForPeople: 50
        };

        this.Level = Level;
    }

    var People = {
        BABY: 'baby',
        GRANNY: 'granny',
        CAT: 'cat'
    };

    var Waste = {
        LENOVO: 'lenovo',
        IPAD: 'ipad',
        SULTAN: 'sultan'
    };

    LevelGenerator.prototype.next = function () {
        if (++this.currentLevel > 7)
            return false;

        return this.Level[this.currentLevel];
    };

    return LevelGenerator;
})();