const Item = require('./location_model.js'),
    Places = require('../places/place_model'),
    // Events = require('../events/event_model'),
    db = require('../../database.js')

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    name: item.name
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ success: false, message: 'Location already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).json({ success: true, message: 'Location created', data: item })
                        })
                }
            })
            .catch(error => res.status(400).json({ success: false, message: error }))
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
                    res.json({ success: true, message: 'Location updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Location does not exists.' })
                }
            })
            .catch(error => res.status(400).send({ success: false, message: error }))
    },

    // Delete a item
    deleteItem: (req, res) => {
        const id = req.params.id
        Item.find({
                where: { id: id }
            })
            .then(item => {
                if (item) {
                    Item.destroy({
                            where: { id: id }
                        })
                        .then(deleted => {
                            if (deleted) res.status(200).json({ status: true, message: 'Location deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'Location does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        Item.findAll().then(items => {
            res.json({ item_count: items.length, items: items })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        var id = req.params.id
        Item.find({
            where: { id: id }
        }).then(item => {
            if (item) {
                res.json({ status: true, message: 'Location found.', data: item })
            } else {
                res.json({ status: false, message: 'Location does not exists.' })
            }
        })
    },

    // Get places by location id
    getPlacesByLocation: (req, res) => {
        var id = req.params.id
        Places.findAll({
            where: { location_id: id }
        }).then(item => {
            if (item) {
                res.json({ status: true, message: 'Places found.', data: item })
            } else {
                res.json({ status: false, message: 'Places does not exists.' })
            }
        })
    },

    // Get places by location id
    getEventsByLocation: (req, res) => {
        var id = req.params.id,
            user = req.params.user
        sql = `SELECT e.*, l.name as location, p.name as place, p.address as place_address, p.city as place_city, p.state as place_state, p.zip as place_zip, p.phone as place_phone, p.website, i.url, a.event_id as going
            FROM events e 
            LEFT JOIN locations l ON l.id = e.location_id
            LEFT JOIN places p ON p.id = e.place_id
            LEFT JOIN images i ON i.uid = e.event_flyer
            LEFT JOIN attendees a ON a.event_id = e.id AND a.user_id = ${user}
            WHERE e.location_id = ${id}
            AND STR_TO_DATE(e.event_date, '%m/%d/%Y') >= NOW()
            ORDER BY STR_TO_DATE(e.event_date, '%m/%d/%Y') ASC`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            res.json({ item_count: results.length, items: results })
        })
    }
}