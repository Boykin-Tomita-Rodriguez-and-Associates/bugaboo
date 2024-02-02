const { Sequelize, db } = require('../db')

let User = db.define('user', {
    email: Sequelize.STRING,
    password: Sequelize.STRING
})

module.exports = User
