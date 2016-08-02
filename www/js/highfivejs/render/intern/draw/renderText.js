H5.renderText = (function (wrapText, Math) {
    "use strict";

    function renderText(ctx, drawable) {
        if (drawable.data.baseLine) {
            ctx.textBaseline = drawable.data.baseLine;
        } else {
            ctx.textBaseline = 'middle';   
        }
        if (drawable.data.align) {
            ctx.textAlign = drawable.data.align;
        } else {
            ctx.textAlign = 'center';
        }
        ctx.fillStyle = drawable.data.color;
        ctx.font = drawable.data.fontStyle + ' ' + drawable.data.size + 'px ' + drawable.data.fontFamily;

        var txtIsToLong = drawable.data.maxLineLength &&
            ctx.measureText(drawable.data.msg).width > drawable.data.maxLineLength;
        if (txtIsToLong) {
            wrapText(ctx, drawable.data.msg, drawable.x, drawable.y, drawable.data.maxLineLength,
                drawable.data.lineHeight, drawable);
        } else {
            ctx.font = drawable.data.fontStyle + ' ' +  Math.floor(drawable.data.size * drawable.scale) + 'px ' 
                + drawable.data.fontFamily;
            ctx.fillText(drawable.data.msg, drawable.x, drawable.y);
        }
    }

    return renderText;
})(H5.wrapText, Math);
