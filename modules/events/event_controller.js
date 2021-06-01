const Item = require('./event_model.js');
const Attendee = require('../attendees/attendee_model');
const db = require('../../database.js');

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    name: item.name,
                    event_date: item.event_date,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    place_id: item.place_id,
                    location_id: item.location_id
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ success: false, message: 'Event already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'Event created', data: item })
                        })
                }
            })
            .catch(error => res.status(400).json({ success: false, message: error.error }))
    },

    // Update a item
    updateItem: (req, res) => {
        const id = req.params.id,
            updates = {}

        for (var ops in req.body) {
            updates[ops] = req.body[ops]
        }

        Item.find({
                where: { id: id }
            })
            .then(item => {
                if (item) return item.updateAttributes(updates)
            })
            .then(updated => {
                if (updated) {
                    res.json({ success: true, message: 'Event updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Event does not exists.' })
                }
            })
            .catch(error => res.status(400).json({ success: false, message: error }))
    },

    // Delete a item
    deleteItem: (req, res) => {
        const id = req.params.id
        Item.findById(id)
            .then(item => {
                if (item) {
                    Item.destroy({
                            where: { id: id }
                        })
                        .then(deleted => {
                            if (deleted) res.status(200).json({ status: true, message: 'Event deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'Event does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        const sql = `SELECT e.*, l.name as location, p.name as place, i.url 
            FROM events e 
            LEFT JOIN locations l ON l.id = e.location_id
            LEFT JOIN places p ON p.id = e.place_id
            LEFT JOIN images i ON i.uid = e.event_flyer
            ORDER BY STR_TO_DATE(e.event_date, '%m/%d/%Y') DESC`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            res.json({ item_count: results.length, items: results })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        const {id} = req.param;
        const sql = `SELECT e.*, l.name as location, p.name as place, i.url
            FROM events e 
            LEFT JOIN locations l ON l.id = e.location_id
            LEFT JOIN places p ON p.id = e.place_id
            LEFT JOIN images i ON i.uid = e.event_flyer
            WHERE e.id = ${id}`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            if (results.length > 0) {
                res.json({ status: true, message: 'Event found.', data: results })
            } else {
                res.json({ status: false, message: 'Event does not exists.' })
            }
        })
    },

    getAttendees: async (req, res) => {
        const {id} = req.param;
        await Item.findById(id).then((result) => {
            console.log('Attendees', results)
        }).catch((err) => {
            console.log('Error', err);
        });
    }
}