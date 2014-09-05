var WindowHelper = (function (calcScreenConst) {
    "use strict";

    return {
        getFirstColumn: function (backGroundImage) {
            return backGroundImage.getCornerX() + calcScreenConst(backGroundImage.getWidth(), 10, 3);
        },
        getSecondColumn: function (backGroundImage) {
            return backGroundImage.getCornerX() + calcScreenConst(backGroundImage.getWidth(), 2);
        },
        getThirdColumn: function (backGroundImage) {
            return backGroundImage.getCornerX() + calcScreenConst(backGroundImage.getWidth(), 10, 7);
        },
        getFirstRow: function (backGroundImage) {
            return backGroundImage.getCornerY() + calcScreenConst(backGroundImage.getHeight(), 100, 26);
        },
        getSecondRow: function (backGroundImage) {
            return backGroundImage.getCornerY() + calcScreenConst(backGroundImage.getHeight(), 100, 39);
        },
        getThirdRow: function (backGroundImage) {
            return backGroundImage.getCornerY() + calcScreenConst(backGroundImage.getHeight(), 100, 52);
        }
    };
    //todo update method calling in WindowView ..and then implement the touchables creation for windows ... think about the bg dependency
})(calcScreenConst);