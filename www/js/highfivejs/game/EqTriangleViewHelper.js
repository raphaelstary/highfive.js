H5.EqTriangleViewHelper = (function (Math, Transition, Width, EqTriangles) {
    "use strict";

    function EqTriangleViewHelper(stage, timer, xTilesCount) {
        this.stage = stage;
        this.timer = timer;
        this.count = xTilesCount;
    }

    var L_SIDE = 'left';
    var R_SIDE = 'right';
    var L_SIDE_START_ANGLE = Math.PI / 2;
    var R_SIDE_START_ANGLE = -Math.PI / 2;
    var WHITE = 'white';

    EqTriangleViewHelper.prototype.create = function (u, v, side) {
        return this.__createTriangle(u, v, side);
    };

    EqTriangleViewHelper.prototype.createLeft = function (u, v) {
        return this.__createTriangle(u, v, L_SIDE);
    };

    EqTriangleViewHelper.prototype.createRight = function (u, v) {
        return this.__createTriangle(u, v, R_SIDE);
    };

    EqTriangleViewHelper.prototype.__createTriangle = function (u, v, side) {
        var triangle;

        if (side == L_SIDE) {
            triangle = this.stage.drawEqTriangle(this.__leftX(u, v), this.__leftY(u, v), L_SIDE_START_ANGLE,
                this.__getRadius.bind(this), WHITE, true);
        } else if (side == R_SIDE) {
            triangle = this.stage.drawEqTriangle(this.__rightX(u, v), this.__rightY(u, v), R_SIDE_START_ANGLE,
                this.__getRadius.bind(this), WHITE, true);
        }

        return triangle;
    };

    EqTriangleViewHelper.prototype.__edgeLength = function (width) {
        return Width.get(this.count)(width);
    };

    EqTriangleViewHelper.prototype.__getRadius = function (width) {
        return EqTriangles.radius(this.__edgeLength(width));
    };

    EqTriangleViewHelper.prototype.__leftX = function (u, v) {
        var self = this;
        return function (width) {
            return EqTriangles.leftX(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__leftY = function (u, v) {
        var self = this;
        return function (height, width) {
            return EqTriangles.leftY(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__rightX = function (u, v) {
        var self = this;
        return function (width) {
            return EqTriangles.rightX(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__rightY = function (u, v) {
        var self = this;
        return function (height, width) {
            return EqTriangles.rightY(u, v, self.__edgeLength(width));
        };
    };

    return EqTriangleViewHelper;
})(Math, H5.Transition, H5.Width, H5.EqTriangles);