H5.SelectionList = (function () {
    'use strict';

    function SelectionList() {
        this.__options = [];
        this.__selection = undefined;

        this.selection = undefined;
        this.references = undefined;
    }

    SelectionList.prototype.add = function (drawable, callback, thisArg, references) {
        var item = {
            selection: drawable,
            callback: thisArg ? callback.bind(thisArg) : callback,
            references: references
        };

        if (this.__options.length == 0) {
            this.__selection = item.callback;
        }
        if (this.__options.length != 0) {
            drawable.setShow(false);
        }

        this.__options.push(item);

        if (this.__options.length == 1) {
            this.selection = drawable;
            this.references = references;
        }
    };

    SelectionList.prototype.previous = function () {
        var newSelection = this.__options.pop();
        newSelection.selection.show = true;

        this.selection = newSelection.selection;
        this.references = newSelection.references;

        if (this.__options[0]) {
            this.__options[0].selection.show = false;
        }
        this.__options.unshift(newSelection);

        this.__selection = newSelection.callback;
    };

    SelectionList.prototype.next = function () {
        this.__options.push(this.__options.shift());
        this.__options[this.__options.length - 1].selection.show = false;
        this.__options[0].selection.show = true;

        this.selection = this.__options[0].selection;
        this.references = this.__options[0].references;

        this.__selection = this.__options[0].callback;
    };

    SelectionList.prototype.execute = function () {
        this.__selection();
    };

    return SelectionList;
})();
