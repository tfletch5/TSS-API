const Item = require('./ambassador_model.js'),
    uuid = require('short-unique-id')
uid = new uuid()

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        item.code = 'tss-' + uid.randomUUID(8)
        Item.find({
                where: {
                    email: item.email
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ success: false, message: 'Ambassador already exist.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'Ambassador created', data: item })
                        })
                }
            })
            .catch(error => res.status(400).send({ success: false, message: error }))
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
                    res.json({ success: true, message: 'Ambassador updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'Ambassador does not exists.' })
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
                            if (deleted) res.status(200).json({ success: true, message: 'Ambassador deleted!' })
                        })
                        .catch(error => res.status(400).json({ success: false, message: error }))
                } else {
                    res.status(400).json({ success: false, message: 'Ambassador does not exists!' })
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
                res.json({ status: true, message: 'Ambassador found.', data: item })
            } else {
                res.json({ status: false, message: 'Ambassador does not exists.' })
            }
        })
    }
}