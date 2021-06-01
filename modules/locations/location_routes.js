// Get the router
const router = require('express').Router(),
    Items = require('./location_controller.js')

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

router
    .route('/:id/places')
    .get(Items.getPlacesByLocation)

router
    .route('/:id/events/:user')
    .get(Items.getEventsByLocation)

//  Make user routes available
module.exports = router