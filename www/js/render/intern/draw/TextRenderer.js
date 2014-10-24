var renderText = (function (wrapText, Math) {
    "use strict";

    function renderText(ctx, drawable) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = drawable.txt.color;
        ctx.font = Math.floor(drawable.txt.size * drawable.scale) + 'px ' + drawable.txt.fontFamily;

        var txtIsToLong = drawable.txt.maxLineLength &&
            ctx.measureText(drawable.txt.msg).width > drawable.txt.maxLineLength;
        if (txtIsToLong) {
            wrapText(ctx, drawable.txt.msg, drawable.x, drawable.y, drawable.txt.maxLineLength,
                drawable.txt.lineHeight);
        } else {
            ctx.fillText(drawable.txt.msg, drawable.x, drawable.y);
        }
    }

    return renderText;
})(wrapText, Math);
