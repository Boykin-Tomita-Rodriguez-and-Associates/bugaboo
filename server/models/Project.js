const { Sequelize, db } = require('../db')

let Project = db.Sequelize('project', {
    isComplete: Sequelize.BOOLEAN,
    name: Sequelize.STRING
})

module.exports = Project