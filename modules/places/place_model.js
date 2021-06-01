const db = require('../../database.js')

var Place = db.sequelize.define('places', {
    location_id: { type: db.Sequelize.INTEGER, allowNull: false },
    name: { type: db.Sequelize.STRING, allowNull: false },
    address: { type: db.Sequelize.STRING, allowNull: false },
    city: { type: db.Sequelize.STRING, allowNull: false },
    state: { type: db.Sequelize.STRING, allowNull: false },
    zip: { type: db.Sequelize.INTEGER, allowNull: false },
    phone: { type: db.Sequelize.STRING, allowNull: false },
    website: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Place