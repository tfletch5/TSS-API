const db = require('../../database.js')

var Code = db.sequelize.define('codes', {
    code: { type: db.Sequelize.STRING, allowNull: false },
    user_id: { type: db.Sequelize.INTEGER, allowNull: true },
    status: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Code