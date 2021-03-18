const User = require('./user')
const uniqid = require('uniqid');
const io = require('./index')

const shortNames = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"]

/**
 * @property {User} owner
 * @property {User[]} users
 */
class Room {
    /**
     * 
     * @param {User} owner 
     */
    constructor(owner) {
        this.id = uniqid();
        this.owner = owner;
        this.users = []
        this.marks = []
        this.lastActive = Date.now()
    }

    updateLastActive() {
        this.lastActive = Date.now()
    }

    /**
     * 
     * @param {User} user 
     */
    addUser(user) {
        if (this.users.length == 4) {
            return false;
        }

        this.users.push(user)
        this.updateLastActive()
    }

    /**
     * 
     * @param {User} user 
     */
    syncMarks(user) {
        io.to(user.socketId).emit('syncMarks', this.marks)
    }

    addMark(user, data) {
        this.marks.push(data)
        io.to(this.id).emit('addMark', { pos: data.pos, name: this.getUserShortName(user) })
    }

    getUserShortName(user) {
        return shortNames[this.users.indexOf(user)]
    }
}

module.exports = Room