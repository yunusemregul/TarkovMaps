const Room = require('./room')

/**
 * @property {Room} room
 */
class User {
    constructor(ip) {
        this.ip = ip
        this.lastActive = Date.now()
        this.connected = false;
        this.socketId = undefined;
    }

    updateLastActive() {
        this.lastActive = Date.now()
    }

    /**
     * 
     * @param {Room} room 
     */
    joinRoom(room) {
        if (room.addUser(this)) {
            this.room = room
            this.updateLastActive()
            return true;
        }

        return false;
    }

    addMark(data) {
        this.room.addMark(this, data);
    }

    getShortName() {
        return this.room.getUserShortName(this)
    }
}

module.exports = User