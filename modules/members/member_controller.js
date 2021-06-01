const Item = require('./member_model.js'),
    db = require('../../database.js')

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    code_id: item.code_id,
                    user_id: item.user_id,
                    membership_id: item.membership_id
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ status: false, message: 'Member already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'Member created', data: item })
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
                    res.json({ success: true, message: 'Member updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Member does not exists.' })
                }
            })
            .catch(error => res.status(400).send(error))
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
                            if (deleted) res.status(200).json({ success: true, message: 'Member deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ success: false, message: 'Member does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        sql = `SELECT m.*, a.code, CONCAT_WS(' ', u.first_name, u.last_name) as user, mb.name
            FROM members m 
            LEFT JOIN  users u ON u.id = m.user_id
            LEFT JOIN ambassadors a ON a.id = m.code_id
            LEFT JOIN memberships mb ON mb.id = m.membership_id`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            res.json({ item_count: results.length, items: results })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        var id = req.params.id
        sql = `SELECT m.*, mb.*
            FROM members m 
            LEFT JOIN memberships mb ON mb.id = m.membership_id
            WHERE m.user_id = ${id}`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            if (results.length > 0) {
                res.json({ success: true, message: 'Member found.', data: results[0] })
            } else {
                res.json({ success: false, message: 'Member does not exists.' })
            }
        })
    }
}