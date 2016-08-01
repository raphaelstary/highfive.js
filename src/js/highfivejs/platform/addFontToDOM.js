H5.addFontToDOM = (function (document) {
    "use strict";

    return function (fonts) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";

        var styleText = "";
        fonts.forEach(function (font) {
            styleText += "@font-face{";
            styleText += "font-family:" + font.name + ";";
            styleText += "src:url(" + font.url + ")format('woff');";
            styleText += "} ";
        });

        styleNode.innerHTML = styleText;
        document.head.appendChild(styleNode);
    };

})(document);