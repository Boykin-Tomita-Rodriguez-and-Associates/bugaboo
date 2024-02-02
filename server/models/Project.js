const { Sequelize, db } = require('../db')

let Project = db.define('project', {
    isComplete: Sequelize.BOOLEAN,
    name: Sequelize.STRING
})

module.exports = Project