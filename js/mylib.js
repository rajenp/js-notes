(function() {
    'use strict';

    var $ = function $(id) {
            return document.getElementById(id);
        },
        trim = function trim(str) {
            str = "" + (str || "");
            return str.replace(/^\s+|\s+$/gm, "");
        },

        //Simple callback - executable function
        Callback = function Callback(func, context) {
            return function(data) {
                if (context) {
                    func.call(context, data);
                } else {
                    func(data);
                }
            };
        },

        //Simple Inheritance
        Extend = function Extend(Child, Parent, prototypes) {
            Child.prototype = new Parent();
            Child.prototype.constructor = Child;
            for (var prop in prototypes) {
                Child.prototype[prop] = prototypes[prop];
            }
            return Child; //Allow chaining
        },
        EventTarget = function EventTarget() {
            this._events = {};
        };

    // Interface implemention
    Function.prototype.Impls = function(iFace) {
        var me = this;
        if (!Array.isArray(iFace)) {
            throw new Error("Interface needs to be defined as an Array");
        }
        //make sure this function has all the methods required by this interface
        iFace.forEach(function(name) {
            var method = me.prototype[name] || me[name];
            if (!method || typeof method !== "function") {
                throw new Error("Missing interface implementation: " + name);
            }
        });
    };

    var Impls = function Impls(me, iFace) {
        if (!Array.isArray(iFace)) {
            throw new Error("Interface needs to be defined as an Array");
        }
        //make sure this function has all the methods required by this interface
        iFace.forEach(function(name) {
            var method = me[name];
            if (!method || typeof method !== "function") {
                throw new Error("Missing interface implementation: " + name);
            }
        });
    };

    Extend(EventTarget, Object, {
        notify: function notify(name, data) {
            var listeners = this._events[name] || [];
            $each(listeners, function(callback) {
                callback(data);
            });
        },
        listen: function listen(name, callback) {
            var listeners = this._events[name] || [];
            listeners.push(callback);
            this._events[name] = listeners;
        }
    });

    window.myLib = {
        $: $,
        trim: trim,
        Callback: Callback,
        Extend: Extend,
        EventTarget: EventTarget,
        Impls: Impls
    };
})();
