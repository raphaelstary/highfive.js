H5.renderEjectaText = (function (Math) {
    'use strict';

    function renderEjectaText(ctx, drawable) {
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
        ctx.font = Math.floor(drawable.data.size * drawable.scale) + 'px AcuminProExtraCond-Light';

        ctx.fillText(drawable.data.msg, drawable.x, drawable.y);
    }

    return renderEjectaText;
})(Math);