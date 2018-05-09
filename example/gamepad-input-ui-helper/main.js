window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .gamePad()
        .build(function (services) {

            var hello = services.visuals.createText('press A or B or START :)')
                .setPosition(H5.Width.HALF, H5.Height.HALF);

            var gamePad = H5.PlayerControls.getGamePad();

            gamePad.add(H5.GamePadButton.A)
                .or(H5.GamePadButton.B)
                .or(H5.GamePadButton.START)
                .onDown(function () {

                    hello.setText('button pressed');

                })
                .onUp(function () {

                    hello.setText('press A or B or START');

                });

            gamePad.register(services.events);
        })
        .start();
};
