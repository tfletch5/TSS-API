const Item = require('./image_model.js'),
    fs = require('fs'),
    path = require('path')

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body
        Item.find({
                where: {
                    event_id: item.event_id,
                    user_id: item.user_id
                }
            }).then((getItem) => {
                if (getItem) {
                    res.status(400).json({ status: false, message: 'You already like this event.' })
                } else {
                    Item.create(item)
                        .then(() => {
                            res.status(200).send({ success: true, message: 'You like this event.', data: item })
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
                    res.json({ status: true, message: 'Like updated.', data: updated })
                } else {
                    res.status(400).json({ status: false, message: 'Like does not exists.' })
                }
            })
            .catch(error => res.status(400).send(error))
    },

    // Delete a item
    deleteItem: (req, res) => {
        const id = req.params.id
        Item.find({
                where: {
                    uid: id,
                }
            })
            .then(item => {
                if (item) {
                    // fs.unlink()
                    Item.destroy({
                            where: {
                                uid: id
                            }
                        })
                        .then(deleted => {
                            if (deleted) res.status(200).json({ status: true, message: 'Like deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'Like does not exists!' })
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
            where: { uid: id }
        }).then(item => {
            if (item) {
                // stream the image back by loading the file
                res.setHeader('Content-Type', 'image/jpeg')
                fs.createReadStream(path.join('uploads', item.filename)).pipe(res)
                    // res.json({ status: true, message: 'Image found.', data: item })
            } else {
                res.json({ status: false, message: 'Image does not exists.' })
            }
        })
    }
}