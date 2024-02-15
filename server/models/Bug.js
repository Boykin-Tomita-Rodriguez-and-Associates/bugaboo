const { DataTypes, db } = require('../db')

let Bug = db.define('bugs', {
    isFixed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
     },
    error: DataTypes.STRING
})

module.exports = Bug