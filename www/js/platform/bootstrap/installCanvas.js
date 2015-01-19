var installCanvas = (function (document, Event) {
    "use strict";

    function installCanvas(width, height, pixelRatio, pixelCanvas, events) {
        var canvas = document.createElement('canvas');

        if (pixelCanvas) {
            var pixelWidth = 256;
            var pixelHeight = 240;
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;

            canvas.style['display'] = 'none';

            var scale = Math.floor(width / pixelWidth);
            var scaledWidth = pixelWidth * scale;
            var scaledHeight = pixelHeight * scale;

            var scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = scaledWidth;
            scaledCanvas.height = scaledHeight;
            var context = scaledCanvas.getContext('2d');
            context['imageSmoothingEnabled'] = false;
            context['mozImageSmoothingEnabled'] = false;
            context['oImageSmoothingEnabled'] = false;
            context['webkitImageSmoothingEnabled'] = false;
            context['msImageSmoothingEnabled'] = false;
            document.body.appendChild(scaledCanvas);

            events.subscribe(Event.TICK_END, function () {
                context.clearRect(0, 0, scaledWidth, scaledHeight);
                context.drawImage(canvas, 0, 0, pixelWidth, pixelHeight, 0, 0, scaledWidth, scaledHeight);
            });

        } else if (pixelRatio > 1) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        document.body.appendChild(canvas);

        return canvas;
    }

    return installCanvas;
})(window.document, Event);