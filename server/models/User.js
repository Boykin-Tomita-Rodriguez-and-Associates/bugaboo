const { DataTypes, db } = require('../db')

let User = db.define('users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
})

module.exports = User
