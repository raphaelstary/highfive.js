H5.Colors = (function () {
    'use strict';

    function toHSL(hue, saturation, brightness) {
        var SB = {
            s: saturation / 100,
            b: brightness / 100
        };
        var SL = {
            s: 0,
            l: 0
        };
        SL.l = (2 - SB.s) * SB.b / 2;
        SL.s = SL.l && SL.l < 1 ? SB.s * SB.b / (SL.l < 0.5 ? SL.l * 2 : 2 - SL.l * 2) : SL.s;

        return 'hsl(' + hue + ',' + (SL.s * 100 | 0) + '%,' + (SL.l * 100 | 0) + '%)';
    }

    return {toHSL: toHSL};
})();
