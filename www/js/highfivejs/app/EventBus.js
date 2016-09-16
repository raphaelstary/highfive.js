H5.EventBus = (function (iterateSomeEntries, Object) {
    "use strict";

    function EventBus() {
        this.dict = {};
        this.idGenerator = 0;
        this.pending = {};
        this.pendingDeletes = [];
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
            if (payload != null) {
                this.pending[eventName] = payload;
            } else {
                this.pending[eventName] = true;
            }
        }
    };

    EventBus.prototype.fireSync = function (eventName, payload) {
        var dict = this.dict[eventName];
        if (dict) {
            Object.keys(dict).forEach(function (key) {
                dict[key](payload);
            });
        }
    };

    EventBus.prototype.subscribe = function (eventName, callback, self) {
        if (!this.dict[eventName])
            this.dict[eventName] = {};

        var id = this.idGenerator++;
        this.dict[eventName][id] = self ? callback.bind(self) : callback;
        return id;
    };

    EventBus.prototype.unsubscribe = function (id) {
        this.pendingDeletes.push(id);
    };

    EventBus.prototype.__delete = function (id) {
        iterateSomeEntries(this.dict, function (subscribers) {
            if (subscribers[id]) {
                delete subscribers[id];
                return true;
            }
            return false;
        });
    };

    EventBus.prototype.updateDeletes = function () {
        this.pendingDeletes.forEach(this.__delete.bind(this));
        while (this.pendingDeletes.length > 0)
            this.pendingDeletes.pop();
    };

    return EventBus;
})(H5.iterateSomeEntries, Object);