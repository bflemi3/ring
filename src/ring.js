var _ = require('utils');

function Promise(fn) {
    if(!_.isFunction(fn)) return _.error('Invalid argument type. A promise only excepts a function.')

    var value = null,
        deferred = null;

    function resolve(value) {
        this.state = 'resolved';
    }

    function reject(value) {
        this.state = 'reject';
    }

    function handle(handler) {
        if(this.state === 'pending') {
            deferred = handler;
            return;
        }

        var callback = this.state === 'resolved' ? handler.onResolved : handler.onRejected;
        if(!callback)

    }

    fn(resolve, reject);
}

function handle(promise, handler) {
    if(promise.state === 'pending') {

    }
}

Promise.prototype = {
    state: 'pending',

    then: function(onResolved, onRejected) {
        // if onResolved is a function then queue it up so we can call it when this.state == resolved
        if(!_.isFunction(onResolved))
            throw new Error("Invalid argument type. 'onResolved' must be a function.");

        // if onRejected is a function then queue it up so we can call it when this.state == rejected
        if(_.isFunction(onRejected))
            throw new Error("Invalid argument type. 'onRejected' must be a function.");

        // return a new promise instance so we can chain
        return new Promise(function(resolve, reject) {
            handle({onResolved: onResolved, onRejected: onRejected, resolve: resolve, reject: reject});
        });
    },

    catch: function(onRejected) {

        return this;
    }
};