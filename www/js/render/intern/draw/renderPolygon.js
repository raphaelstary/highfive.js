var renderPolygon = (function (Math) {
    "use strict";

    function renderPolygon(ctx, x, y, radius, sides, startAngle, anticlockwise, colorFill) {
        var angle = (Math.PI * 2) / sides;
        angle = anticlockwise ? -angle : angle;

        ctx.translate(x, y);
        ctx.rotate(startAngle);
        ctx.moveTo(radius, 0);
        for (var vertex = 1; vertex < sides; vertex++)
            ctx.lineTo(radius * Math.cos(angle * vertex), radius * Math.sin(angle * vertex));

        if (colorFill) {
            ctx.fillStyle = colorFill;
            ctx.fill();
        }
        ctx.closePath();
    }

    return renderPolygon;
})(Math);
