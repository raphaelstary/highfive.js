H5.UniversalTranslator = (function (defaultLanguage, Repository) {
    "use strict";

    function UniversalTranslator(locales) {
        this.locales = locales;
        this.defaultLanguageCode = defaultLanguage;
        this.language = defaultLanguage ? defaultLanguage.substring(0, 2) : 'en';

        if (!this.locales[this.language])
            this.language = 'en';

        this.repo = new Repository();
    }

    UniversalTranslator.prototype.setLanguage = function (languageCode) {
        this.language = languageCode;
        this.repo.call(this);
    };

    UniversalTranslator.prototype.getLanguages = function () {
        var languages = [];
        Object.keys(this.locales).forEach(function (language) {
            languages.push({
                language: language,
                name: this.locales[language].display_name
            })
        }, this);
        return languages;
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

    UniversalTranslator.prototype.resetStorage = function () {
        this.repo = new Repository();
    };

    return UniversalTranslator;
})(window.navigator.language || window.navigator.userLanguage, H5.Repository);