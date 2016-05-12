H5.wrapText = (function (Math) {
    "use strict";

    function wrapText(context, text, x, y, maxWidth, lineHeight, drawable) {
        var words = text.split(' ');
        var line = '';

        var readyLines = [];

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                readyLines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        readyLines.push(line);

        var totalHeight = readyLines.length * lineHeight / 2;
        var newStartY = y - Math.floor(totalHeight / 2);

        context.font = drawable.data.fontStyle + ' ' +  Math.floor(drawable.data.size * drawable.scale) + 'px ' +
            drawable.data.fontFamily;

        for (var i = 0; i < readyLines.length; i++) {
            context.fillText(readyLines[i], x, newStartY);
            newStartY += lineHeight;
        }
    }

    return wrapText;
})(Math);