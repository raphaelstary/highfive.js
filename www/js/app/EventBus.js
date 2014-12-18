var EventBus = (function (iterateSomeEntries, Object, iterateEntries) {
    "use strict";

    function EventBus() {
        this.dict = {};
        this.idGenerator = 0;
        this.pending = {};
    }

    EventBus.prototype.update = function () {
        Object.keys(this.pending).forEach(function (key) {
            var payload = this.pending[key];
            var subscribers = this.dict[key];
            Object.keys(subscribers).forEach(function (subscriberKey) {
                subscribers[subscriberKey](payload);
            });
            delete this.pending[key];
        }, this);
    };

    EventBus.prototype.fire = function (eventName, payload) {
        var subscribers = this.dict[eventName];
        if (subscribers) {
            if (payload) {
                this.pending[eventName] = payload;
            } else {
                this.pending[eventName] = true;
            }
        }
    };

    EventBus.prototype.syncFire = function (eventName) {
        var dict = this.dict[eventName];
        if (dict) {
            iterateEntries(dict, function (callback) {
                callback();
            });
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
})(iterateSomeEntries, Object, iterateEntries);