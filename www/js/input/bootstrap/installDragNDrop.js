var installDragNDrop = (function (window, DragHandler) {
    "use strict";

    function installDragNDrop(canvas) {
        var drag = new DragHandler();

        if(window.PointerEvent) {

            canvas.addEventListener('pointerdown', drag.pointerDown.bind(drag));
            canvas.addEventListener('pointermove', drag.pointerMove.bind(drag));
            canvas.addEventListener('pointerup', drag.pointerUp.bind(drag));

        } else if (window.MSPointerEvent) {

            canvas.addEventListener('MSPointerDown', drag.pointerDown.bind(drag));
            canvas.addEventListener('MSPointerMove', drag.pointerMove.bind(drag));
            canvas.addEventListener('MSPointerUp', drag.pointerUp.bind(drag));

        } else {
            if ('ontouchstart' in window) {

                canvas.addEventListener('touchstart', drag.touchStart.bind(drag));
                canvas.addEventListener('touchmove', drag.touchMove.bind(drag));
                canvas.addEventListener('touchend', drag.touchEnd.bind(drag));
            }
            canvas.addEventListener('mousedown', drag.pointerDown.bind(drag));
            canvas.addEventListener('mousemove', drag.pointerMove.bind(drag));
            canvas.addEventListener('mouseup', drag.pointerUp.bind(drag));
        }

        return drag;
    }

    return installDragNDrop;
})(window, DragHandler);