const Item = require('./survey_model.js'),
    db = require('../../database.js')

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    user_id: item.user_id
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ status: false, message: 'Survey already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'Survey created', data: item })
                        })
                }
            })
            .catch(error => res.status(400).send(error))
    },

    // Update a item
    updateItem: (req, res) => {
        const id = req.params.id,
            updates = {}

        for (var ops in req.body) {
            updates[ops] = req.body[ops]
        }

        Item.find({
                where: { user_id: id }
            })
            .then(item => {
                if (item) return item.updateAttributes(updates)
            })
            .then(updated => {
                if (updated) {
                    res.json({ success: true, message: 'Survey updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Survey does not exists.' })
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
                            if (deleted) res.status(200).json({ status: true, message: 'Survey deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'Survey does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        sql = `SELECT s.*, CONCAT_WS(' ', u.first_name, u.last_name) as user 
            FROM surveys s
            LEFT JOIN users u ON u.id = s.user_id`

        db.sequelize.query(sql).then(items => {
            var results = items[0]
            res.json({ item_count: results.length, items: results })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        var id = req.params.id
        sql = `SELECT s.*, CONCAT_WS(' ', u.first_name, u.last_name) as user 
            FROM surveys s
            LEFT JOIN users u ON u.id = s.user_id
            WHERE s.user_id = ${id}`

        db.sequelize.query(sql).then(items => {
            var results = items[0]
            if (results.length > 0) {
                res.json({ success: true, message: 'Survey found.', data: results[0] })
            } else {
                res.json({ success: false, message: 'Survey does not exists.' })
            }
        })
    }
}