const User = require('./user')
const uniqid = require('uniqid');

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
        this.lastActive = Date.now()
    }

    updateLastActive() {
        this.lastActive = Date.now()
    }

    /**
     * 
     * @param {User} user 
     */
    userAdd(user) {
        if (this.users.length == 5)
        {
            return false;
        }

        this.users.push(user);
        updateLastActive()
    }


    getUserShortName(user) {
        return shortNames[this.users.indexOf(user)]
    }
}

module.exports = Room