H5.Vectors = (function (Math) {
    "use strict";

    return {
        get: function (pointA_X, pointA_Y, pointB_X, pointB_Y) {
            return {
                x: pointB_X - pointA_X,
                y: pointB_Y - pointA_Y
            };
        },

        magnitude: function (x, y) {
            return Math.sqrt(x * x + y * y);
        },

        squaredMagnitude: function (x, y) {
            return x * x + y * y;
        },

        normalize: function (x, y) {
            var magnitude = this.magnitude(x, y);

            return this.normalizeWithMagnitude(x, y, magnitude);
        },

        normalizeWithMagnitude: function (x, y, magnitude) {
            return {
                x: x / magnitude,
                y: y / magnitude
            };
        },

        normalRight: function (x, y) {
            return {
                x: -y,
                y: x
            };
        },

        normalLeft: function (x, y) {
            return {
                x: y,
                y: -x
            };
        },

        dotProduct: function (vectorA_X, vectorA_Y, vectorB_X, vectorB_Y) {
            return vectorA_X * vectorB_X + vectorA_Y * vectorB_Y;
        },

        toRadians: function (degrees) {
            return degrees * Math.PI / 180;
        },

        getX: function (pointX, magnitude, angle) {
            return pointX + magnitude * Math.cos(angle);
        },

        getY: function (pointY, magnitude, angle) {
            return pointY + magnitude * Math.sin(angle);
        },

        getAngle: function (x, y) {
            return Math.atan2(y, x);
        },

        getIntersectionPoint: function (a1_x, a1_y, a2_x, a2_y, b1_x, b1_y, b2_x, b2_y) {
            var denominator = ( b2_y - b1_y) * (a2_x - a1_x) - (b2_x - b1_x) * (a2_y - a1_y);
            var ua = ((b2_x - b1_x) * (a1_y - b1_y) - (b2_y - b1_y) * (a1_x - b1_x)) / denominator;
            return {
                x: a1_x + ua * (a2_x - a1_x),
                y: a1_y + ua * (a2_y - a1_y)
            }
        }
    };
})(Math);
