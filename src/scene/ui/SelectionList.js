H5.SelectionList = (function () {
    'use strict';

    function SelectionList() {
        this.options = [];
        this.selection = null;
    }

    SelectionList.prototype.add = function (drawable, callback, self) {
        var item = {
            selection: drawable,
            callback: self ? callback.bind(self) : callback
        };

        if (this.options.length == 0) {
            this.selection = item.callback;
        }
        if (this.options.length != 0) {
            drawable.setShow(false);
        }

        this.options.push(item);
    };

    SelectionList.prototype.previous = function () {
        var newSelection = this.options.pop();
        newSelection.selection.show = true;
        if (this.options[0]) {
            this.options[0].selection.show = false;
        }
        this.options.unshift(newSelection);

        this.selection = newSelection.callback;
    };

    SelectionList.prototype.next = function () {
        this.options.push(this.options.shift());
        this.options[this.options.length - 1].selection.show = false;
        this.options[0].selection.show = true;

        this.selection = this.options[0].callback;
    };

    SelectionList.prototype.execute = function () {
        this.selection();
    };

    return SelectionList;
})();
