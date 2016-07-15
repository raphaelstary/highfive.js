H5.Grid = (function () {
    "use strict";

    function Grid(level) {
        this.__init(level);
    }

    Grid.prototype.__init = function (level) {
        this.map = [];

        var foreground = level.front ? level.front : level;
        for (var y = 0; y < foreground.length; y++) {
            var levelRow = foreground[y];
            var row = [];
            for (var x = 0; x < levelRow.length; x++) {
                row.push(levelRow[x]);
            }
            this.map.push(row);
        }

        this.xTiles = foreground[0].length;
        this.yTiles = foreground.length;
        this.__yTiles = foreground.length;

        if (level.back) {
            this.backgroundMap = [];
            var background = level.back;
            for (y = 0; y < background.length; y++) {
                levelRow = background[y];
                row = [];
                for (x = 0; x < levelRow.length; x++) {
                    row.push(levelRow[x]);
                }
                this.backgroundMap.push(row);
            }

            this.getBackground = function (u, v) {
                if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles)
                    return;
                return this.backgroundMap[v][u];
            };
        }

        if (level.events) {
            this.eventsMap = [];
            var events = level.events;
            for (y = 0; y < events.length; y++) {
                levelRow = events[y];
                row = [];
                for (x = 0; x < levelRow.length; x++) {
                    row.push(levelRow[x]);
                }
                this.eventsMap.push(row);
            }

            this.getEvent = function (u, v) {
                if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles)
                    return;
                return this.eventsMap[v][u];
            };
        }
    };

    Grid.prototype.reload = function (level) {
        this.__init(level);
    };

    Grid.prototype.get = function (u, v) {
        if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles)
            return;
        return this.map[v][u];
    };

    Grid.prototype.set = function (u, v, load) {
        this.map[v][u] = load;
    };

    return Grid;
})();