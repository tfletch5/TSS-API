const db = require('../../database.js')

var Member = db.sequelize.define('members', {
    code_id: { type: db.Sequelize.INTEGER, allowNull: false },
    user_id: { type: db.Sequelize.INTEGER, allowNull: false },
    membership_id: { type: db.Sequelize.STRING, allowNull: false },
    subscription_id: { type: db.Sequelize.STRING, allowNull: false },
    status: { type: db.Sequelize.STRING, allowNull: false }
})

module.exports = Member