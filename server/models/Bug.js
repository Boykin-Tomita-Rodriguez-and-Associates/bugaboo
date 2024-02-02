const { Sequelize, db } = require('../db')

let Bug = db.Sequelize('bug', {
    isFixed: Sequelize.BOOLEAN,
    error: Sequelize.STRING
})

module.exports = Bug