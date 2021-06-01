const db = require('../../database.js')

var Image = db.sequelize.define('images', {
    uid: { type: db.Sequelize.INTEGER, allowNull: false },
    filename: { type: db.Sequelize.STRING, allowNull: false },
    originalname: { type: db.Sequelize.STRING, allowNull: false },
    path: { type: db.Sequelize.STRING, allowNull: false },
    mimetype: { type: db.Sequelize.STRING, allowNull: false },
    size: { type: db.Sequelize.INTEGER, allowNull: false },
    url: { type: db.Sequelize.STRING, allowNull: false },
    event_id: { type: db.Sequelize.INTEGER, allowNull: true }
})

module.exports = Image