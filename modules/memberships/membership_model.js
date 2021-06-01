const db = require('../../database.js')

var Membership = db.sequelize.define('memberships', {
    name: { type: db.Sequelize.STRING, allowNull: false },
    description: { type: db.Sequelize.STRING, allowNull: false },
    cost: { type: db.Sequelize.INTEGER, allowNull: false },
    frequency: { type: db.Sequelize.STRING, allowNull: false },
    cost_per_event: { type: db.Sequelize.STRING, allowNull: false },
    product_id: { type: db.Sequelize.STRING, allowNull: true },
    plan_id: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Membership