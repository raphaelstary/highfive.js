H5.GridHelper = (function (Math, calcCantorPairing, Strings) {
    "use strict";

    function GridHelper(grid) {
        this.grid = grid;
    }

    GridHelper.prototype.getNeighbors = function (u, v) {
        var neighbors = [];
        var bottom = this.getBottomNeighbor(u, v);
        if (bottom)
            neighbors.push(bottom);
        var right = this.getRightNeighbor(u, v);
        if (right)
            neighbors.push(right);
        var top = this.getTopNeighbor(u, v);
        if (top)
            neighbors.push(top);
        var left = this.getLeftNeighbor(u, v);
        if (left)
            neighbors.push(left);

        return neighbors;
    };

    GridHelper.prototype.getBottomNeighbor = function (u, v) {
        return this.__getTile(u, v + 1);
    };

    GridHelper.prototype.getTopNeighbor = function (u, v) {
        return this.__getTile(u, v - 1);
    };

    GridHelper.prototype.getLeftNeighbor = function (u, v) {
        return this.__getTile(u - 1, v);
    };

    GridHelper.prototype.getRightNeighbor = function (u, v) {
        return this.__getTile(u + 1, v);
    };

    GridHelper.prototype.getBackgroundBottomNeighbor = function (u, v) {
        return this.__getTile(u, v + 1, true);
    };

    GridHelper.prototype.getBackgroundTopNeighbor = function (u, v) {
        return this.__getTile(u, v - 1, true);
    };

    GridHelper.prototype.getBackgroundLeftNeighbor = function (u, v) {
        return this.__getTile(u - 1, v, true);
    };

    GridHelper.prototype.getBackgroundRightNeighbor = function (u, v) {
        return this.__getTile(u + 1, v, true);
    };

    GridHelper.prototype.__getTile = function (u, v, isBackground) {
        var type = !isBackground ? this.grid.get(u, v) : this.grid.getBackground(u, v);
        if (type !== undefined)
            return {
                u: u,
                v: v,
                type: type
            };
    };

    GridHelper.prototype.getTopNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getTopNeighbor.bind(this)]);
    };

    GridHelper.prototype.getLeftNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getLeftNeighbor.bind(this)]);
    };

    GridHelper.prototype.getRightNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getRightNeighbor.bind(this)]);
    };

    GridHelper.prototype.getBottomNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getBottomNeighbor.bind(this)]);
    };

    GridHelper.prototype.getTopNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getTopNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getLeftNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getLeftNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getRightNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getRightNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getBottomNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getBottomNeighbor.bind(this)]), tiles);
    };

    function getNeighbors(tiles, neighborFnList) {
        var neighbors = [];
        var visited = {};
        neighborFnList.forEach(function (neighborFn) {
            tiles.forEach(function (tile) {
                var neighbor = neighborFn(tile.u, tile.v);
                if (neighbor) {
                    var hash = calcCantorPairing(neighbor.u, neighbor.v);
                    var isVisited = visited[hash];
                    if (!isVisited) {
                        visited[hash] = true;
                        neighbors.push(neighbor);
                    }
                }
            });
        });
        return neighbors;
    }

    function complement(setB, setA) {
        return setB.filter(function (b) {
            return setA.every(function (a) {
                return b.type !== a.type;
            });
        });
    }

    GridHelper.prototype.complement = complement;

    function getSetFromAllSetsByTile(allSets, tile) {
        for (var i = 0; i < allSets.length; i++) {
            var mySet = allSets[i];
            for (var j = 0; j < mySet.length; j++) {
                var body = mySet[j];
                if (body.type == tile.type)
                    return mySet;
            }
        }
    }

    GridHelper.prototype.getSetFromAllSetsByTile = getSetFromAllSetsByTile;

    function getSetFromAllSetsByType(allSets, type) {
        return getSetFromAllSetsByTile(allSets, {type: type});
    }

    GridHelper.prototype.getSetFromAllSetsByType = getSetFromAllSetsByType;

    function getTileFromSetByType(mySet, type) {
        for (var i = 0; i < mySet.length; i++) {
            var tile = mySet[i];
            if (tile.type == type)
                return tile;
        }
    }

    GridHelper.prototype.getTileFromSetByType = getTileFromSetByType;

    GridHelper.prototype.isNeighbor = function (a_u, a_v, b_u, b_v) {
        var deltaX = Math.abs(a_u - b_u);
        if (deltaX > 1 || (a_u === b_u && a_v === b_v))
            return false;
        var deltaY = Math.abs(a_v - b_v);
        if (deltaY > 1 || deltaX + deltaY > 1)
            return false;
        var neighbor = this.grid.get(b_u, b_v);
        return neighbor !== undefined;
    };

    GridHelper.prototype.isOnSameAxis = function (a_u, a_v, b_u, b_v) {
        return a_u == b_u || a_v == b_v;
    };

    GridHelper.prototype.equals = function (objectA, objectB) {
        return objectA.u === objectB.u && objectA.v === objectB.v && objectA.type === objectB.type;
    };

    GridHelper.prototype.getTiles = function (tileName, isBackground) {
        var tiles = [];

        for (var y = 0; y < this.grid.yTiles; y++) {
            for (var x = 0; x < this.grid.xTiles; x++) {
                var tile = !isBackground ? this.grid.get(x, y) : this.grid.getBackground(x, y);
                if (tile && Strings.startsWidth(tile, tileName))
                    tiles.push({
                        u: x,
                        v: y,
                        type: tile
                    });
            }
        }

        return tiles;
    };

    GridHelper.prototype.getTile = function (tileName, isBackground) {
        for (var y = 0; y < this.grid.yTiles; y++) {
            for (var x = 0; x < this.grid.xTiles; x++) {
                var tile = !isBackground ? this.grid.get(x, y) : this.grid.getBackground(x, y);
                if (tile && Strings.startsWidth(tile, tileName))
                    return {
                        u: x,
                        v: y,
                        type: tile
                    };
            }
        }
    };

    return GridHelper;
})(Math, H5.calcCantorPairing, H5.Strings);