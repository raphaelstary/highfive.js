var renderText = (function (wrapText, Math) {
    "use strict";

    function renderText(ctx, drawable) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = drawable.data.color;
        ctx.font = Math.floor(drawable.data.size * drawable.scale) + 'px ' + drawable.data.fontFamily;

        var txtIsToLong = drawable.data.maxLineLength &&
            ctx.measureText(drawable.data.msg).width > drawable.data.maxLineLength;
        if (txtIsToLong) {
            wrapText(ctx, drawable.data.msg, drawable.x, drawable.y, drawable.data.maxLineLength,
                drawable.data.lineHeight);
        } else {
            ctx.fillText(drawable.data.msg, drawable.x, drawable.y);
        }
    }

    return renderText;
})(wrapText, Math);
