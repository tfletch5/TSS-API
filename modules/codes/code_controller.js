const Item = require('./code_model.js'),
    uuid = require('short-unique-id')
uid = new uuid()

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = { code: 'tss-' + uid.randomUUID(8) }
        Item.create(item)
            .then(() => {
                res.status(200).send({ success: true, message: 'Code created', data: item })
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
                    res.json({ status: true, message: 'Code updated.', data: updated })
                } else {
                    res.status(400).json({ status: false, message: 'Code does not exists.' })
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
                            if (deleted) res.status(200).json({ status: true, message: 'Code deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'Code does not exists!' })
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
                res.json({ status: true, message: 'Code found.', data: item })
            } else {
                res.json({ status: false, message: 'Code does not exists.' })
            }
        })
    }
}