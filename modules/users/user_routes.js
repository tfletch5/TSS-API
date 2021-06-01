// Get the router
const router = require('express').Router(),
    Items = require('./user_controller.js')

// Get all items: api/items
router
    .route('/')
    .get(Items.getAll)
    // .post(Items.createItem)

// Get item: api/items/:id
router
    .route('/:id')
    .get(Items.getItem)
    .patch(Items.updateItem)
    .delete(Items.deleteItem)

router
    .route('/:id/events')
    .get(Items.getEvent)

router
    .route('/:id/membership')
    .get(Items.getMembership)

//  Make user routes available
module.exports = router