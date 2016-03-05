H5.PointerHandler = (function (Event, Object, Math) {
    "use strict";

    function PointerHandler(events, device) {
        this.events = events;
        this.device = device;
        this.activePointers = {};
        this.changed = false;
        this.pendingDeletes = [];
    }

    var Pointer = {
        DOWN: 'down',
        MOVE: 'move',
        UP: 'up'
    };

    PointerHandler.prototype.pointerDown = function (event) {
        event.preventDefault();
        this.activePointers[event.pointerId] = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            changed: true,
            type: Pointer.DOWN
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
            current.type = Pointer.MOVE;
            this.changed = true;
        }
    };

    PointerHandler.prototype.pointerUp = function (event) {
        event.preventDefault();
        var current = this.activePointers[event.pointerId];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
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
            changed: true,
            type: Pointer.DOWN
        };
        this.changed = true;
    };

    PointerHandler.prototype.mouseMove = function (event) {
        event.preventDefault();
        var current = this.activePointers['mouse'];
        if (current && (current.type == Pointer.DOWN || current.type == Pointer.MOVE)) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            current.type = Pointer.MOVE;
            this.changed = true;
        }
    };

    PointerHandler.prototype.mouseUp = function (event) {
        event.preventDefault();
        var current = this.activePointers['mouse'];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
    };

    PointerHandler.prototype.mouseCancel = function (event) {
        this.mouseUp(event);
    };

    PointerHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            this.activePointers[touches[i].identifier] = {
                id: touches[i].identifier,
                x: touches[i].clientX,
                y: touches[i].clientY,
                changed: true,
                type: Pointer.DOWN
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
            current.type = Pointer.MOVE;
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchEnd = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var ref = touches[i];
            var current = this.activePointers[ref.identifier];
            current.x = ref.clientX;
            current.y = ref.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
    };

    PointerHandler.prototype.touchCancel = function (event) {
        this.touchEnd(event);
    };

    PointerHandler.prototype.update = function () {
        if (this.changed) {
            Object.keys(this.activePointers).forEach(function (pointerId) {
                var pointer = this.activePointers[pointerId];
                if (pointer.changed) {
                    if (this.device.screenScale) {
                        pointer.x = Math.floor(pointer.x / this.device.screenScale);
                        pointer.y = Math.floor(pointer.y / this.device.screenScale);
                    }
                    if (this.device.devicePixelRatio > 1) {
                        pointer.x = Math.floor(pointer.x * this.device.devicePixelRatio);
                        pointer.y = Math.floor(pointer.y * this.device.devicePixelRatio);
                    }
                    this.events.fireSync(Event.POINTER, pointer);
                    pointer.changed = false;
                }
            }, this);
            this.changed = false;
        }

        this.pendingDeletes.forEach(function (pointer) {
            delete this.activePointers[pointer.id];
        }, this);
        while (this.pendingDeletes.length > 0)
            this.pendingDeletes.pop();
    };

    return PointerHandler;
})(H5.Event, Object, Math);