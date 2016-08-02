H5.CirclePath = (function () {
    "use strict";

    function CirclePath(x, y, radius, startAngle, endAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    return CirclePath;
})();