const {sequelize, Sequelize} = require('../../database.js')
const Model = Sequelize.Model;
const Attendee = require('../attendees/attendee_model');
const Location = require('../locations/location_model');

class Event extends Model {}

Event.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    event_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_time: {
        type: Sequelize.STRING,
        allowNull: false
    },
    end_time: {
        type: Sequelize.STRING,
        allowNull: false
    },
    event_flyer: {
        type: Sequelize.STRING,
        allowNull: true
    },
    place_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cost: {
        type: Sequelize.STRING,
        allowNull: false
    },
    location_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'event',
    underscored: true,
    timestamps: false
});

// Event.hasOne(Location);
Event.hasMany(Attendee, { 
    foreignKey: 'event_id'
});
// Attendee.belongsTo(Event);

module.exports = Event;
