// simplest event emitter class i can think of
export default class Eventer {
    constructor() {
        this.events = {}
    }

    addListener(name, callback) {
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(callback)
    }

    removeListener(name, callback) {
        if (this.events[name]) {
            // look if we find the callback in the array
            const index = this.events[name].findIndex(item => item == callback)
            if (index != -1) {
                // delete this entry
                this.events[name].splice(index, 1)
            }
            if (this.events[name].length == 0) {
                delete this.events[name]
            }
        }
    }

    emitEvent(name, data) {
        if (this.events[name]) {
            this.events[name].forEach(callback => {
                callback.call(null, data)
            });
        }
    }
}