H5.EqTriangleGrid = (function (Math) {
    "use strict";

    function EqTriangleGrid(xTiles, yTiles) {
        this.xTiles = xTiles;
        this.yTiles = yTiles;
        this.map = [];
        for (var y = 0; y < yTiles; y++) {
            var row = [];
            for (var x = 0; x < xTiles * 2 - 1; x++) {
                row.push(true);
            }
            this.map.push(row);
        }
    }

    EqTriangleGrid.prototype.getLeft = function (u, v) {
        if (v % 2 == 0) {
            return this.map[v][(u + Math.floor(v / 2)) * 2];
        } else {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 1];
        }
    };

    EqTriangleGrid.prototype.setLeft = function (u, v) {
        if (v % 2 == 0) {
            this.map[v][(u + Math.floor(v / 2)) * 2] = false;
        } else {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 1] = false;
        }
    };

    EqTriangleGrid.prototype.getRight = function (u, v) {
        if (v % 2 == 0) {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 1];
        } else {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 2];
        }
    };

    EqTriangleGrid.prototype.setRight = function (u, v) {
        if (v % 2 == 0) {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 1] = false;
        } else {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 2] = false;
        }
    };

    EqTriangleGrid.prototype.set = function (u, v, side) {
        if (side == 'left') {
            this.setLeft(u, v);
        } else if (side == 'right') {
            this.setRight(u, v);
        }
    };

    EqTriangleGrid.prototype.get = function (u, v, side) {
        if (v < 0 || v >= this.yTiles)
            return false;
        if (v % 2 == 0 && u < -Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 1 && side == 'right' && u < -(Math.floor(v / 2) + 1)) {
            return false;
        } else if (v % 2 == 1 && side == 'left' && u < -Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 0 && side == 'left' && u > this.xTiles - 1 - Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 0 && side == 'right' && u > this.xTiles - 1 - (Math.floor(v / 2) + 1)) {
            return false;
        } else if (v % 2 == 1 && u > this.xTiles - 1 - (Math.floor(v / 2) + 1)) {
            return false;
        }

        if (side == 'left') {
            return this.getLeft(u, v);
        } else if (side == 'right') {
            return this.getRight(u, v);
        }
    };

    return EqTriangleGrid;
})(Math);