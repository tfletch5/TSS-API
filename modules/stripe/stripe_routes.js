// Get the router
const router = require('express').Router(),
    Items = require('./stripe_controller.js')

// Product Management Routes
router
    .route('/products')
    .get(Items.getAllProducts)
    .post(Items.createProducts)

router
    .route('/products/:id')
    .get(Items.getProduct)
    .patch(Items.updateProduct)
    .delete(Items.deleteProduct)

// Plan Management Routes
router
    .route('/plans')
    .post(Items.createPlans)

router
    .route('/plans/:id')
    .delete(Items.deletePlan)

// Customer Management Routes
router
    .route('/customers')
    .get(Items.getAllCustomers)
    .post(Items.createCustomer)

router
    .route('/customers/:id')
    .delete(Items.deleteCustomer)

// Subscription Management Routes
router
    .route('/subscriptions')
    .get(Items.getAllSubscriptions)
    .post(Items.createSubscription)

router
    .route('/subscriptions/:id')
    .delete(Items.deleteSubscription)

// Charge Management Routes
router
    .route('/charges')
    .post(Items.createCharge)

// Source Management Routes
router
    .route('/sources')
    .post(Items.createSource)

//  Make user routes available
module.exports = router