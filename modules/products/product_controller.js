var stripe = require('stripe')(process.env.STRIPE_TEST_KEY)

module.exports = {
    // Create Item
    createItem: (req, res) => {
        var item = req.body
        stripe.products.create({
            name: item.name,
            type: 'good',
            description: item.description
        }, function(err, product) {
            if (err) return res.status(400).json({ success: false, message: 'Product not created.' })
            res.status(200).json({ success: true, message: 'Product created', data: product })
        })
    },

    // Update an item
    updateItem: (req, res) => {
        const id = req.params.id
        stripe.products.update(id, {
            metadata: { order_id: '6735' }
        })
    },

    // Delete an item
    deleteItem: (req, res) => {
        const id = req.params.id
        stripe.products.del(id,
            function(err, confirmation) {
                if (err) return res.status(400).json({ success: false, message: 'Product not deleted.' })
                res.status(200).json({ success: true, message: 'Product deleted', data: confirmation })
            }
        )
    },

    // Get all items
    getAll: (req, res) => {
        stripe.products.list({ limit: 3 },
            function(err, products) {
                if (err) return res.status(400).json({ success: false, message: 'Product not found.' })
                res.status(200).json({ success: true, message: 'Products found', data: products })
            }
        )
    },

    // Get a specific item
    getItem: (req, res) => {
        const id = req.params.id
        stripe.products.retrieve(id,
            function(err, product) {
                if (err) return res.status(400).json({ success: false, message: 'Product not exist.' })
                res.status(200).json({ success: true, message: 'Product found', data: product })
            }
        )
    }
}