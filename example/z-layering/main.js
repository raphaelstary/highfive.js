window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .responsive()
        .build(function (services) {
            var Width = H5.Width;
            var Height = H5.Height;
            var Font = H5.Font;
            var stage = services.stage;
            var timer = services.timer;

            var drawable1 = stage.createRectangle(true)
                .setWidth(Font.get(3))
                .setHeight(Height.THIRD)
                .setPosition(Width.get(15, 6), Height.get(5))
                .setColor('darkorchid')
                .setZIndex(0);

            var drawable2 = stage.createRectangle(true)
                .setWidth(Font.get(3))
                .setHeight(Height.THIRD)
                .setPosition(Width.get(15, 7), Height.get(5, 2))
                .setColor('darkmagenta')
                .setZIndex(1);

            var drawable3 = stage.createRectangle(true)
                .setWidth(Font.get(3))
                .setHeight(Height.THIRD)
                .setPosition(Width.get(15, 8), Height.get(5, 3))
                .setColor('darkslateblue')
                .setZIndex(2);

            var drawable4 = stage.createRectangle(true)
                .setWidth(Font.get(3))
                .setHeight(Height.THIRD)
                .setPosition(Width.get(15, 9), Height.get(5, 4))
                .setColor('goldenrod')
                .setZIndex(3);

            var drawables = [
                drawable1,
                drawable2,
                drawable3,
                drawable4
            ];

            function initFutureZIndexChange() {
                timer.in(30, function () {
                    // drawables.unshift(drawables.pop());
                    drawables.reverse()
                        .forEach(function (drawable, index) {
                            drawable.setZIndex(index);
                        });
                    initFutureZIndexChange();
                });
            }

            initFutureZIndexChange();
        })
        .start();
};
