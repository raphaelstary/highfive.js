var ShipHelper = (function (changeCoords, widthHalf, __400) {
    "use strict";

    function drawShip(stage, screenWidth, screenHeight) {
        return stage.drawFresh(widthHalf(screenWidth), __400(screenHeight), 'ship');
    }

    function resizeShip(ship, screenWidth, screenHeight) {
        changeCoords(ship, widthHalf(screenWidth), __400(screenHeight));
    }

    return {
        draw: drawShip,
        resize: resizeShip
    };
})(changeCoords, widthHalf, __400);