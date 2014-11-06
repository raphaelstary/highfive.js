var Vectors = (function (Math) {
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
        }
    };
})(Math);
