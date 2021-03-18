const User = require('./user')
const uniqid = require('uniqid');
const io = require('./index')

const shortNames = [{ title: "A", color: 'red' }, { title: "B", color: 'green' }, { title: "C", color: 'blue' }, { title: "D", color: 'pink' }, { title: "E", color: 'orange' }]

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
        this.lastMarkId = 0
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
        if (this.users.length == 5) {
            return false;
        }

        this.users.push(user)
        user.room = this
        this.updateLastActive()
    }

    /**
     * 
     * @param {User} user 
     */
    removeUser(user) {
        this.users = this.users.filter((otherUser) => otherUser.ip != user.ip)
    }

    /**
     *  
     * @param {User} user 
     */
    syncMarks(user) {
        io.to(user.socketId).emit('syncMarks', this.marks)
    }

    /**
     *  
     * @param {User} user 
     */
    addMark(user, data) {
        data = { ownerIp: user.ip, id: this.lastMarkId++, pos: data.pos, ...this.getUserBadge(user) }
        this.marks[data.id] = data
        io.to(this.id).emit('addMark', data)
    }

    /**
     *  
     * @param {User} user 
     */
    deleteMark(user, id) {
        if (!this.marks[id]) return false;
        if (this.marks[id].ownerIp !== user.ip) return false;

        this.marks[id] = null
        io.to(this.id).emit('deleteMark', id)
    }

    getUserBadge(user) {
        return shortNames[this.users.findIndex((otherUser) => (otherUser.ip === user.ip))]
    }
}

module.exports = Room