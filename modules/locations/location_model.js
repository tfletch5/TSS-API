const db = require('../../database.js')

var Location = db.sequelize.define('locations', {
    name: { type: db.Sequelize.STRING, allowNull: false },
    logo: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Location