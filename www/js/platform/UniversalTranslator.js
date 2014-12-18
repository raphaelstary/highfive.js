var UniversalTranslator = (function (defaultLanguage, Repository) {
    "use strict";

    function UniversalTranslator(locales) {
        this.locales = locales;
        this.language = defaultLanguage ? defaultLanguage.substring(0, 2) : 'en';
        this.repo = new Repository();
    }

    UniversalTranslator.prototype.setLanguage = function (languageCode) {
        this.language = languageCode;
        this.repo.call();
    };

    UniversalTranslator.prototype.get = function (domainKey, msgKey) {
        return this.locales[this.language][domainKey][msgKey];
    };

    UniversalTranslator.prototype.add = function (idObj, msgObj, ctxKey, msgKey) {
        this.repo.add(idObj, function (messages) {
            msgObj.msg = messages.get(ctxKey, msgKey);
        });
    };

    UniversalTranslator.prototype.remove = function (idObj) {
        this.repo.remove(idObj);
    };

    return UniversalTranslator;
})(window.navigator.language || window.navigator.userLanguage, Repository);