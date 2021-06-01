const db = require('../../database.js')

var User = db.sequelize.define('users', {
    code: { type: db.Sequelize.INTEGER, allowNull: false },
    first_name: { type: db.Sequelize.STRING, allowNull: false },
    last_name: { type: db.Sequelize.STRING, allowNull: false },
    address: { type: db.Sequelize.STRING, allowNull: true },
    city: { type: db.Sequelize.STRING, allowNull: true },
    state: { type: db.Sequelize.STRING, allowNull: true },
    zip: { type: db.Sequelize.INTEGER, allowNull: true },
    email: { type: db.Sequelize.STRING, allowNull: false },
    phone: { type: db.Sequelize.STRING, allowNull: true },
    birthday: { type: db.Sequelize.STRING, allowNull: true },
    password: { type: db.Sequelize.STRING, allowNull: false },
    userlevel: { type: db.Sequelize.STRING, allowNull: false },
    customer_id: { type: db.Sequelize.STRING, allowNull: false },
    location_id: { type: db.Sequelize.INTEGER, allowNull: false },
    ambassador_id: { type: db.Sequelize.INTEGER, allowNull: false }
})

module.exports = User