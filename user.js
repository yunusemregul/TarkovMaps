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
        if (this.room)
            return;

        if (room.addUser(this)) {
            this.room = room
            this.updateLastActive()
            return true;
        }

        return false;
    }

    leaveRoom() {
        if (!this.room) return;

        this.room.removeUser(this)
        this.room = undefined
        this.updateLastActive()
    }

    addMark(data) {
        this.room.addMark(this, data);
        this.updateLastActive()
    }

    deleteMark(id) {
        this.room.deleteMark(this, id);
        this.updateLastActive()
    }

    getShortName() {
        return this.room.getUserBadge(this)
    }
}

module.exports = User