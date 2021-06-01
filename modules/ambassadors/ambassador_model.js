const db = require('../../database.js')

var Ambassador = db.sequelize.define('ambassadors', {
    first: { type: db.Sequelize.STRING, allowNull: false },
    last: { type: db.Sequelize.STRING, allowNull: false },
    phone: { type: db.Sequelize.STRING, allowNull: false },
    email: { type: db.Sequelize.STRING, allowNull: false },
    code: { type: db.Sequelize.STRING, allowNull: false }
})

module.exports = Ambassador