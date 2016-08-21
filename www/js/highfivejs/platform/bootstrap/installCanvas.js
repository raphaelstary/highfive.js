H5.installCanvas = (function (document, Event, Math) {
    "use strict";

    function installCanvas(events, device, optionalCanvas, width, height, pixelRatio, pixelWidth, pixelHeight) {
        var canvas = optionalCanvas || document.createElement('canvas');

        if (pixelWidth && pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;

            canvas.style['display'] = 'none';

            var scale = height / pixelHeight;
            var scaledWidth = pixelWidth * scale;
            var scaledHeight = pixelHeight * scale;
            device.screenScale = scale;

            var scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = scaledWidth;
            scaledCanvas.height = scaledHeight;
            var context = scaledCanvas.getContext('2d');
            if ('imageSmoothingEnabled' in context) {
                context.imageSmoothingEnabled = false;
            } else if ('mozImageSmoothingEnabled' in context) {
                context.mozImageSmoothingEnabled = false;
            } else if ('webkitImageSmoothingEnabled' in context) {
                context.webkitImageSmoothingEnabled = false;
            } else if ('msImageSmoothingEnabled' in context) {
                context.msImageSmoothingEnabled = false;
            }
            document.body.appendChild(scaledCanvas);

            events.subscribe(Event.RESIZE, function (event) {
                // var realScreenWidth = Math.floor(event.cssWidth * event.devicePixelRatio);
                var realScreenHeight = Math.floor(event.cssHeight * event.devicePixelRatio);

                var scale = realScreenHeight / pixelHeight;
                scaledWidth = pixelWidth * scale;
                scaledHeight = pixelHeight * scale;
                scaledCanvas.width = scaledWidth;
                scaledCanvas.height = scaledHeight;
                device.screenScale = scale;

                var context = scaledCanvas.getContext('2d');
                if ('imageSmoothingEnabled' in context) {
                    context.imageSmoothingEnabled = false;
                } else if ('mozImageSmoothingEnabled' in context) {
                    context.mozImageSmoothingEnabled = false;
                } else if ('webkitImageSmoothingEnabled' in context) {
                    context.webkitImageSmoothingEnabled = false;
                } else if ('msImageSmoothingEnabled' in context) {
                    context.msImageSmoothingEnabled = false;
                }
            });

            events.subscribe(Event.TICK_END, function () {
                context.clearRect(0, 0, scaledWidth, scaledHeight);
                context.drawImage(canvas, 0, 0, pixelWidth, pixelHeight, 0, 0, scaledWidth, scaledHeight);
            });

        } else if (pixelRatio > 1) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        if (!optionalCanvas)
            document.body.appendChild(canvas);

        return {
            screen: canvas,
            scaledScreen: scaledCanvas
        };
    }

    return installCanvas;
})(window.document, H5.Event, Math);