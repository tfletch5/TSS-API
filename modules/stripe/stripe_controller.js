var stripe = require('stripe')(process.env.STRIPE_TEST_KEY)

module.exports = {
    // Product Management
    getAllProducts: (req, res) => {
        stripe.products.list({ limit: 3 },
            function(err, products) {
                if (err) res.status(400).json({ success: false, message: 'Product not found.' })
                res.status(200).json({ success: true, message: 'Products found', data: products })
            }
        )
    },
    createProducts: (req, res) => {
        var item = req.body
        stripe.products.create(item, function(err, product) {
            if (err) res.status(400).json({ success: false, message: 'Product not created.' })
            res.status(200).json({ success: true, message: 'Product created', data: product })
        })
    },
    getProduct: (req, res) => {
        const id = req.params.id
        stripe.products.retrieve(id,
            function(err, product) {
                if (err) res.status(400).json({ success: false, message: 'Product not exist.' })
                res.status(200).json({ success: true, message: 'Product found', data: product })
            }
        )
    },
    updateProduct: (req, res) => {
        const id = req.params.id
        stripe.products.update(id, {
            metadata: { order_id: '6735' }
        })
    },
    deleteProduct: (req, res) => {
        const id = req.params.id
        stripe.products.del(id,
            function(err, confirmation) {
                if (err) res.status(400).json({ success: false, message: 'Product not deleted.' })
                res.status(200).json({ success: true, message: 'Product deleted', data: confirmation })
            }
        )
    },

    //   Plan Management
    createPlans: (req, res) => {
        var item = req.body
        stripe.plans.create(item, function(err, plan) {
            if (err) res.status(400).json({ success: false, message: 'Plan not created.' })
            res.status(200).json({ success: true, message: 'Plan created', data: plan })
        })
    },
    deletePlan: (req, res) => {
        const id = req.params.id
        stripe.plans.del(id, function(err, confirmation) {
            if (err) res.status(400).json({ success: false, message: 'Plan not deleted.' })
            res.status(200).json({ success: true, message: 'Plan deleted', data: confirmation })
        })
    },

    // Customer Management
    getAllCustomers: (req, res) => {
        stripe.customers.list({ limit: 3 },
            function(err, customers) {
                if (err) res.status(400).json({ success: false, message: 'Customers not found.' })
                res.status(200).json({ success: true, message: 'Customers found', data: customers })
            }
        )
    },
    createCustomer: (req, res) => {
        var item = req.body
        stripe.customers.create(item, function(err, customer) {
            if (err) res.status(400).json({ success: false, message: 'Customer not created.' })
            res.status(200).json({ success: true, message: 'Customer created', data: customer })
        })
    },
    deleteCustomer: (req, res) => {
        var id = req.params.id
        stripe.customers.del(id, function(err, confirmation) {
            if (err) res.status(400).json({ success: false, message: 'Customer not deleted.' })
            res.status(200).json({ success: true, message: 'Customer deleted', data: confirmation })
        })
    },

    // Subscription Management
    getAllSubscriptions: (req, res) => {
        stripe.subscriptions.list({ limit: 3 },
            function(err, customers) {
                if (err) res.status(400).json({ success: false, message: 'Subscriptions not found.' })
                res.status(200).json({ success: true, message: 'Subscriptions found', data: customers })
            }
        )
    },
    createSubscription: (req, res) => {
        var item = req.body
        stripe.subscriptions.create(item, function(err, subscription) {
            if (err) res.status(400).json({ success: false, message: 'Subscription not created.' })
            res.status(200).json({ success: true, message: 'Subscription created', data: subscription })
        })
    },
    deleteSubscription: (req, res) => {
        const id = req.params.id
        stripe.customers.del(id, function(err, confirmation) {
            if (err) res.status(400).json({ success: false, message: 'Subscription not deleted.' })
            res.status(200).json({ success: true, message: 'Subscription deleted', data: confirmation })
        })
    },

    // Charge Management
    createCharge: (req, res) => {
        const item = req.body
        stripe.charges.create(item, function(err, charge) {
            if (err) res.status(400).json({ success: false, message: 'Charge not created.' })
            res.status(200).json({ success: true, message: 'Your purchase was successful.', data: charge })
        })
    },

    // Source Management
    createSource: (req, res) => {
        const customer_id = req.body.customer_id,
            source_id = req.body.source_id,
            subscription_id = req.body.subscription_id,
            plan_id = req.body.plan_id

        // Attach the source to the customer
        stripe.customers.createSource(
            customer_id, { source: source_id },
            function(err, source) {
                if (err) res.status(400).json({ success: false, message: 'Source not created.' })
                stripe.subscriptions.retrieve(subscription_id, function(err, subscription) {
                    stripe.subscriptions.update(subscription_id, {
                        cancel_at_period_end: false,
                        prorate: true,
                        items: [{
                            id: subscription.items.data[0].id,
                            plan: plan_id
                        }]
                    }, function(err, confirmation) {
                        console.log('Stripe Controller line 179 Err: ', err)
                        if (err) res.status(400).json({ success: false, message: 'Subscription not changed.' })
                        else res.status(200).json({ success: true, message: 'Subscription changed', data: confirmation })
                    })
                });
            }
        );
    }
}