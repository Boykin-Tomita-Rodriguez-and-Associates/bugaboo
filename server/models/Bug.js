const { Sequelize, db } = require('../db')

let Bug = db.define('bug', {
    isFixed: Sequelize.BOOLEAN,
    error: Sequelize.STRING
})

module.exports = Bug