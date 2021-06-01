// Get the router
const router = require('express').Router(),
    Items = require('./transaction_controller.js')

// Get all items: api/items
router
    .route('/')
    .get(Items.getAll)
    .post(Items.createItem)

// Get item: api/items/:id
router
    .route('/:id')
    .get(Items.getItem)
    // .patch(Items.updateItem)
    // .delete(Items.deleteItem)

router
    .route('/customer/:id')
    .get(Items.getCustomerTransactions)

//  Make user routes available
module.exports = router