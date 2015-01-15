var PointerHandler = (function (Event, Object) {
    "use strict";

    function PointerHandler(events) {
        this.events = events;
        this.activePointers = {};
        this.changed = false;
    }

    PointerHandler.prototype.pointerDown = function (event) {
        event.preventDefault();
        this.activePointers[event.pointerId] = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            changed: true
        };
        this.changed = true;
    };

    PointerHandler.prototype.pointerMove = function (event) {
        event.preventDefault();
        var current = this.activePointers[event.pointerId];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            this.changed = true;
        }
    };

    PointerHandler.prototype.pointerUp = function (event) {
        event.preventDefault();
        delete this.activePointers[event.pointerId];
        this.changed = true;
    };

    PointerHandler.prototype.pointerCancel = function (event) {
        this.pointerUp(event);
    };

    PointerHandler.prototype.mouseDown = function (event) {
        event.preventDefault();
        this.activePointers['mouse'] = {
            id: 'mouse',
            x: event.clientX,
            y: event.clientY,
            changed: true
        };
        this.changed = true;
    };

    PointerHandler.prototype.mouseMove = function (event) {
        event.preventDefault();
        var current = this.activePointers['mouse'];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            this.changed = true;
        }
    };

    PointerHandler.prototype.mouseUp = function (event) {
        event.preventDefault();
        delete this.activePointers['mouse'];
        this.changed = true;
    };

    PointerHandler.prototype.mouseCancel = function () {
        this.mouseUp();
    };

    PointerHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            this.activePointers[touches[i].identifier] = {
                id: touches[i].identifier,
                x: touches[i].clientX,
                y: touches[i].clientY,
                changed: true
            };
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchMove = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var ref = touches[i];
            var current = this.activePointers[ref.identifier];
            current.x = ref.clientX;
            current.y = ref.clientY;
            current.changed = true;
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchEnd = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            delete this.activePointers[touches[i].identifier];
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchCancel = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            delete this.activePointers[touches[i].identifier];
            this.changed = true;
        }
    };

    PointerHandler.prototype.update = function () {
        if (this.changed) {
            Object.keys(this.activePointers).forEach(function (pointer) {
                if (pointer.changed) {
                    this.events.fireSync(Event.POINTER, pointer);
                    pointer.changed = false;
                }
            }, this);
            this.changed = false;
        }
    };

    return PointerHandler;
})(Event, Object);