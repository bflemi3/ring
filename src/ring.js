var _ = require('utils');

var PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2;

function Promise(fn) {
    if(!_.isFunction(fn)) return _.error('Invalid argument type. A promise only excepts a function.');

    var _value = null,
        deferred = null;

    function resolve(value) {
        try {
            if(value && _.isFunction(value.then)) {
                value.then(resolve, reject);
                return;
            }

            this.state = RESOLVED;
            _value = value;
            handle(this, this.deferred);
        } catch(e) {
            reject(e);
        }

    }

    function reject(value) {
        if(value && _.isFunction(value.then)) {
            value.then(resolve, reject);
            return;
        }

        this.state = REJECTED;
        _value = value;
        handle(this, this.deferred)
    }

    fn(resolve, reject);
}

function handle(promise, handler) {
    if(promise.state === PENDING) {
        promise.deferred = handler;
        return;
    }

    setTimeout(function() {
        // handle if there is a callback
        var callback = promise.state === RESOLVED ? handler.onResolved : handler.onRejected;
        if(callback && _.isFunction(callback)) {
            try {
                handler.resolve(callback(promise.value));
            } catch(e) {
                handler.reject(e);
            }
        }

        // if there isn't a callback then resolve or reject appropriately
        if(promise.state === RESOLVED)
            handler.resolve(promise.value);
        return;

        handler.reject(promise.value);
    }, 0);
}

Promise.prototype = {
    state: PENDING,

    deferred: null,

    then: function(onResolved, onRejected) {
        // return a new promise instance so we can chain
        return new Promise(function(resolve, reject) {
            handle(this, {onResolved: onResolved, onRejected: onRejected, resolve: resolve, reject: reject});
        });
    },

    catch: function(onRejected) {

        return new Promise(function(resolve, reject) {
            handle(this, {onRejected: onRejected, resolve: resolve, reject: reject});
        });
    }
};