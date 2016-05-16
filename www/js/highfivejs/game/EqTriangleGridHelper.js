H5.EqTriangleGridHelper = (function (Math) {
    "use strict";

    function EqTriangleGridHelper(grid, xTiles, yTiles) {
        this.grid = grid;
        this.xTiles = xTiles;
        this.yTiles = yTiles;
    }

    EqTriangleGridHelper.prototype.getTopLeft = function () {
        return {
            x: 0,
            y: 0,
            side: 'left'
        };
    };

    EqTriangleGridHelper.prototype.getTopRight = function () {
        return {
            x: this.xTiles - 1,
            y: 0,
            side: 'left'
        };
    };

    EqTriangleGridHelper.prototype.getBottomLeft = function () {
        var lastY = this.yTiles - 1;
        if (lastY % 2 == 0) {
            return {
                x: -Math.floor(lastY / 2),
                y: lastY,
                side: 'left'
            };
        } else {
            return {
                x: -(Math.floor(lastY / 2) + 1),
                y: lastY,
                side: 'right'
            }
        }
    };

    EqTriangleGridHelper.prototype.getBottomRight = function () {
        var lastY = this.yTiles - 1;
        var lastX = this.xTiles - 1;
        if (lastY % 2 == 0) {
            return {
                x: lastX - Math.floor(lastY / 2),
                y: lastY,
                side: 'left'
            };
        } else {
            return {
                x: lastX - (Math.floor(lastY / 2) + 1),
                y: lastY,
                side: 'right'
            }
        }
    };

    EqTriangleGridHelper.prototype.getEmptyNeighbors = function (u, v, side) {
        var neighbors = [];
        if (side == 'left') {
            if (this.grid.get(u, v, 'right')) {
                neighbors.push({
                    x: u,
                    y: v,
                    side: 'right'
                });
            }
            if (this.grid.get(u - 1, v, 'right')) {
                neighbors.push({
                    x: u - 1,
                    y: v,
                    side: 'right'
                });
            }
            if (this.grid.get(u, v - 1, 'right')) {
                neighbors.push({
                    x: u,
                    y: v - 1,
                    side: 'right'
                });
            }
        } else if (side == 'right') {
            if (this.grid.get(u, v, 'left')) {
                neighbors.push({
                    x: u,
                    y: v,
                    side: 'left'
                });
            }
            if (this.grid.get(u + 1, v, 'left')) {
                neighbors.push({
                    x: u + 1,
                    y: v,
                    side: 'left'
                });
            }
            if (this.grid.get(u, v + 1, 'left')) {
                neighbors.push({
                    x: u,
                    y: v + 1,
                    side: 'left'
                });
            }
        }
        return neighbors;
    };

    EqTriangleGridHelper.prototype.getNextEmptyTriangleFromBottom = function () {
        for (var v = this.grid.map.length - 1; v >= 0; v--) {
            var row = this.grid.map[v];
            for (var u = row.length - 1; u >= 0; u--) {
                var triangle = row[u];
                if (triangle) {
                    return transform(u, v);
                }
            }
        }
    };

    EqTriangleGridHelper.prototype.getNextEmptyTriangleFromTop = function () {
        for (var v = 0; v < this.grid.map.length; v++) {
            var row = this.grid.map[v];
            for (var u = 0; u < row.length; u++) {
                var triangle = row[u];
                if (triangle) {
                    return transform(u, v);
                }
            }
        }
    };

    function transform(u, v) {
        var x;
        var side;
        if (v % 2 == 0) {
            if (u % 2 == 0) {
                side = 'left';
                x = (u + Math.floor(v / 2)) * 2;
            } else {
                side = 'right';
                x = (u + Math.floor(v / 2)) * 2 + 1;
            }
        } else {
            if (u % 2 == 0) {
                side = 'right';
                x = Math.floor(u / 2) - (Math.floor(v / 2) + 1);
            } else {
                side = 'left';
                x = Math.floor(u / 2) - (Math.floor(v / 2) + 1);
            }
        }
        return {
            x: x,
            y: v,
            side: side
        };
    }

    return EqTriangleGridHelper;
})(Math);