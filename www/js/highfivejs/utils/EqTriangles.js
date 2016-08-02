H5.EqTriangles = (function (Math) {
    "use strict";

    /**
     * equilateral triangle formulas:
     *
     * h = Math.sqrt(3) / 2 * a
     * p = 3 * a
     * A = a*a * Math.sqrt(3) / 4
     * R = Math.sqrt(3) / 3 * a
     * r = Math.sqrt(3) / 6 * a
     * r = R / 2
     * angle = 60
     *
     * \----/\
     *  \L / R\   'left' triangle center: (x = a / 2 , y = r)
     *   \/____\  'right' triangle center: (x = a , y = R)
     *
     */
    return {
        radius: function (a) {
            return Math.sqrt(3) / 3 * a;
        },

        inRadius: function (a) {
            return this.radius(a) / 2;
        },

        height: function (a) {
            return Math.sqrt(3) / 2 * a;
        },

        rightX: function (u, v, a) {
            return a + a / 2 * v + a * u;
        },

        rightY: function rightY(u, v, a) {
            return this.radius(a) + this.height(a) * v;
        },
        leftX: function (u, v, a) {
            return a / 2 + a / 2 * v + a * u;
        },

        leftY: function (u, v, a) {
            return this.inRadius(a) + this.height(a) * v;
        }
    };
})(Math);