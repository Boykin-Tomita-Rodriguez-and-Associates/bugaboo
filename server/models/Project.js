const { DataTypes, db } = require('../db')

let Project = db.define('projects', {
    isComplete: {
       type: DataTypes.BOOLEAN,
       defaultValue: false
    },
    name: DataTypes.STRING
});

module.exports = Project 