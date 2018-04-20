H5.mapToWideScreen = (function (Promise, Math) {
    'use strict';

    function mapToWideScreen(event) {
        return new Promise(function (fulfill) {

            var width = event.target.innerWidth;
            var height = event.target.innerHeight;

            if (width * (9 / 16) > height) {

                var smallerWidthTarget = {
                    innerWidth: Math.floor(height * (16 / 9)),
                    innerHeight: height
                };

                fulfill({target: smallerWidthTarget});

            } else {

                var smallerHeightTarget = {
                    innerWidth: width,
                    innerHeight: Math.floor(width * (9 / 16))
                };

                fulfill({target: smallerHeightTarget});
            }
        });
    }

    return mapToWideScreen;
})(H5.Promise, Math);
