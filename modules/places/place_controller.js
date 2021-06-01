const Item = require('./place_model.js'),
    db = require('../../database.js')

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    location_id: item.location_id,
                    name: item.name,
                    city: item.city,
                    state: item.state
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ success: false, message: 'Place already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).json({ success: true, message: 'Place created', data: item })
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
                    res.json({ success: true, message: 'Place updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Place does not exists.' })
                }
            })
            .catch(error => res.status(400).json({ success: false, message: error }))
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
                            if (deleted) res.status(200).json({ success: true, message: 'Place deleted!' })
                        })
                        .catch(error => res.status(400).json({ success: false, message: error }))
                } else {
                    res.status(400).json({ success: false, message: 'Place does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        sql = `SELECT p.*, l.name as location
            FROM places p
            LEFT JOIN locations l ON l.id = p.location_id`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            res.json({ item_count: results.length, items: results })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        var id = req.params.id
        sql = `SELECT p.*, l.name as location
            FROM places p
            LEFT JOIN locations l ON l.id = p.location_id
            WHERE p.id = ${id}`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            if (results.length > 0) {
                res.json({ status: true, message: 'Place found.', data: results })
            } else {
                res.json({ status: false, message: 'Place does not exists.' })
            }
        })
    }
}