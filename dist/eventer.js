"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// simplest event emitter class i can think of
var Eventer = function () {
    function Eventer() {
        _classCallCheck(this, Eventer);

        this.events = {};
    }

    _createClass(Eventer, [{
        key: "addListener",
        value: function addListener(name, callback) {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        }
    }, {
        key: "removeListener",
        value: function removeListener(name, callback) {
            if (this.events[name]) {
                // look if we find the callback in the array
                var index = this.events[name].findIndex(function (item) {
                    return item == callback;
                });
                if (index != -1) {
                    // delete this entry
                    this.events[name].splice(index, 1);
                }
                if (this.events[name].length == 0) {
                    delete this.events[name];
                }
            }
        }
    }, {
        key: "emitEvent",
        value: function emitEvent(name, data) {
            if (this.events[name]) {
                this.events[name].forEach(function (callback) {
                    callback.call(null, data);
                });
            }
        }
    }]);

    return Eventer;
}();

exports.default = Eventer;