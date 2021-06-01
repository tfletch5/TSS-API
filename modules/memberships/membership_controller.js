const Item = require('./membership_model.js')

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
                    res.status(400).json({ status: false, message: 'Membership already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'Membership created', data: item })
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
                where: { id: id }
            })
            .then(item => {
                if (item) return item.updateAttributes(updates)
            })
            .then(updated => {
                if (updated) {
                    res.json({ success: true, message: 'Membership updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Membership does not exists.' })
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
                            if (deleted) res.status(200).json({ success: true, message: 'Membership deleted!' })
                        })
                        .catch(error => res.status(400).send({ success: false, message: error }))
                } else {
                    res.status(400).json({ success: false, message: 'Membership does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        Item.findAll({
            order: [
                ['cost', 'ASC']
            ]
        }).then(items => {
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
                res.json({ status: true, message: 'Membership found.', data: item })
            } else {
                res.json({ status: false, message: 'Membership does not exists.' })
            }
        })
    }
}