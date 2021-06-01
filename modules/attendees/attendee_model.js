const db = require('../../database.js')

var Attendee = db.sequelize.define('attendees', {
    event_id: { type: db.Sequelize.INTEGER, allowNull: false },
    user_id: { type: db.Sequelize.INTEGER, allowNull: false }
})

module.exports = Attendee