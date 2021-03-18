const Room = require('./room')

/**
 * @property {Room} room
 */
class User {
    constructor(ip) {
        this.ip = ip
        this.lastActive = Date.now()
    }

    updateLastActive() {
        this.lastActive = Date.now()
    }

    /**
     * 
     * @param {Room} room 
     */
    joinRoom(room) {
        if (room.userAdd(this)) {
            this.room = room
            updateLastActive()
            return true;
        }

        return false;
    }
}

module.exports = User