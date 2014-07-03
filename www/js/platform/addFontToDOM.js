var addFontToDOM = (function (document) {
    "use strict";

    return function (name, url) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";

        var styleText = "@font-face{";
        styleText += "font-family:'" + name + "';";
        styleText += "src:url('" + url + "')format('woff');";
        styleText += "}";

        styleNode.innerHTML = styleText;
        document.head.appendChild(styleNode);
    };

})(document);