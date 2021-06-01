const db = require('../../database.js')

var Transaction = db.sequelize.define('transactions', {
    charge_id: { type: db.Sequelize.STRING, allowNull: false },
    customer_id: { type: db.Sequelize.STRING, allowNull: false },
    amount: { type: db.Sequelize.STRING, allowNull: false },
    amount_refunded: { type: db.Sequelize.STRING, allowNull: false },
    balance_trans: { type: db.Sequelize.STRING, allowNull: true },
    captured: { type: db.Sequelize.BOOLEAN, allowNull: true },
    currency: { type: db.Sequelize.STRING, allowNull: true },
    description: { type: db.Sequelize.STRING, allowNull: true },
    failure_code: { type: db.Sequelize.STRING, allowNull: true },
    failure_message: { type: db.Sequelize.STRING, allowNull: true },
    paid: { type: db.Sequelize.BOOLEAN, allowNull: true },
    refund_url: { type: db.Sequelize.STRING, allowNull: true },
    source_id: { type: db.Sequelize.STRING, allowNull: true },
    last4: { type: db.Sequelize.STRING, allowNull: true },
    status: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Transaction