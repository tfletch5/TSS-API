// Get the router
const router = require('express').Router(),
    Items = require('./image_controller.js')
upload = require('../../index'),
    Image = require('../images/image_model'),
    uuid = require('short-unique-id'),
    uid = new uuid()

// Get all items: api/items
router
    .route('/')
    .get(Items.getAll)
    .post(Items.createItem)

// Get item: api/items/:id
router
    .route('/:id')
    .get(Items.getItem)
    .patch(Items.updateItem)
    .delete(Items.deleteItem)

//  Make user routes available
module.exports = router