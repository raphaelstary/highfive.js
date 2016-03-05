H5.renderPolygon = (function (Math) {
    "use strict";

    function renderPolygon(ctx, x, y, polygon, sides, scale) {
        var angle = (Math.PI * 2) / sides;
        var anticlockwise = false;
        angle = anticlockwise ? -angle : angle;
        var radius;
        if (scale) {
            radius = polygon.radius * scale + 1;
        } else {
            radius = polygon.radius + 1;
        }
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(polygon.angle);
        ctx.moveTo(radius, 0);
        for (var vertex = 1; vertex < sides; vertex++)
            ctx.lineTo(radius * Math.cos(angle * vertex), radius * Math.sin(angle * vertex));

        ctx.closePath();

        if (polygon.filled) {
            ctx.fillStyle = polygon.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = polygon.color;
            ctx.lineWidth = polygon.lineWidth;
            ctx.stroke();
        }
    }

    return renderPolygon;
})(Math);