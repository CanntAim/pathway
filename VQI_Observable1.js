/*
 * Class VQIObservable
 * @author Pujan Joshi
 * @Date April 21, 2014
 * This is a generic Observable class
 * This class has basic methods to deal with observers
 * This class is also observer so it can subscribe to another obvervable class.
 * 
 */

var VQI_Observable = function() {
    this.subscribers = {
        any: [] // event type: subscribers
    };
    this.subscribe = function(fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    };
    this.unsubscribe = function(fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    };
    this.publish = function(fn, type) {
        this.visitSubscribers('publish', fn, type);
    };
    this.loading = function(fn, type) {
        this.visitSubscribers('loading', fn, type);
    };
    this.visitSubscribers = function(action, fn, type) {
        var pubtype = type || 'any';
        var subscribers = this.subscribers[pubtype];
        subscribers = subscribers || 0;
        var i;
        var max = subscribers.length;

        for (i = 0; i < max; i += 1) {
            if (action === 'publish') {
//                console.log(this);
                subscribers[i].update(fn, type);
            } else if (action === 'loading') {

                subscribers[i].loading();

            } else {
                if (subscribers[i] === fn) {
                    subscribers.splice(i, 1);
                }
            }
        }
    };
    
    this.subscribeTo = function(observable, type){
        observable.subscribe(this, type);
    };
};