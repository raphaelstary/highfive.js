H5.HolmesConnector = (function (loadString, JSON, XMLHttpRequest, localStorage) {
    "use strict";

    function HolmesConnector(url, tenantCode, appKeyCode) {
        this.url = url;
        this.tenantCode = tenantCode;
        this.appKeyCode = appKeyCode;
    }

    var Method = {
        REGISTER: '/register',
        EVENT: '/event'
    };
    var CLIENT_ID = '-client_id';

    HolmesConnector.prototype.register = function () {
        var clientId = loadString(this.appKeyCode + CLIENT_ID);
        if (clientId) {
            this.clientId = clientId;
            return;
        }

        var self = this;
        this.__request(Method.REGISTER, {tenant: this.tenantCode}, function () {
            clientId = this.responseText;
            if (clientId) {
                localStorage.setItem(self.appKeyCode + CLIENT_ID, clientId);
                self.clientId = clientId;
            }
        });
    };

    HolmesConnector.prototype.send = function (data) {
        if (!this.clientId)
            return;

        var payload = {
            id: this.clientId,
            tenant: this.tenantCode
        };
        for (var key in data)
            payload[key] = data[key];

        this.__request(Method.EVENT, payload);
    };

    HolmesConnector.prototype.__request = function (method, payload, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url + method);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = callback;
        xhr.send(JSON.stringify(payload));
    };

    return HolmesConnector;
})(H5.loadString, JSON, XMLHttpRequest, H5.lclStorage);