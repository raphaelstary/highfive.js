var EventBus = (function (iterateSomeEntries, Object) {
    "use strict";

    function EventBus() {
        this.dict = {};
        this.idGenerator = 0;
        this.pending = {};
    }

    EventBus.prototype.update = function () {
        Object.keys(this.pending).forEach(function (key) {
            var subscribers = this.dict[key];
            Object.keys(subscribers).forEach(function (subscriberKey) {
                subscribers[subscriberKey]();
            });
            delete this.pending[key];
        }, this);

    };

    EventBus.prototype.fire = function (eventName) {
        var subscribers = this.dict[eventName];
        if (subscribers) {
            this.pending[eventName] = true;
        }
    };

    EventBus.prototype.subscribe = function (eventName, callback) {
        if (!this.dict[eventName])
            this.dict[eventName] = {};

        var id = this.idGenerator++;
        this.dict[eventName][id] = callback;
        return id;
    };

    EventBus.prototype.unsubscribe = function (id) {
        iterateSomeEntries(this.dict, function (subscribers) {
            if (subscribers[id]) {
                delete subscribers[id];
                return true;
            }
            return false;
        });
    };

    return EventBus;
})(iterateSomeEntries, Object);