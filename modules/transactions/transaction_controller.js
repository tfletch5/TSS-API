const Item = require('./transaction_model.js'),
    User = require('../users/user_model'),
    db = require('../../database.js'),
    nodemailer = require('nodemailer'),
    move_decimal = require('move-decimal-point');

module.exports = {
    // Create an item
    createItem: (req, res) => {
        var item = req.body

        Item.create(item).then((trans) => {
                User.find({
                    attributes: { exclude: ['code', 'address', 'city', 'state', 'zip', 'phone', 'birthday', 'password', 'userlevel', 'location_id', 'ambassador_id', 'createdAt', 'updatedAt'] },
                    where: { customer_id: item.customer_id }
                }).then(user => {
                    // var transporter = nodemailer.createTransport({
                    //   service: 'gmail',
                    //   auth: {
                    //     user: 'thesecretsociety.us@gmail.com',
                    //     pass: 'Lovelife12061206!'
                    //   }
                    // })

                    var transporter = nodemailer.createTransport({
                        host: 'mail.thesecretsociety.us',
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'sales@thesecretsociety.us', // generated ethereal user
                            pass: 'NP7(9?HRn%e[' // generated ethereal password
                        }
                    })

                    var mailOptions = {
                        from: '"The Secret Society" <sales@thesecretsociety.us>',
                        to: user.email,
                        subject: 'Your TSS Receipt',
                        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                  <html xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                      <title>Test Email Sample</title>
                      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
                      <style>
                        .em_body { color: #ffffff; }
                      </style>
                    </head>
                    <body class="em_body" style="margin:0px; padding:0px; background-color="#000000">
                      <div>
                          <img src="http://thesecretsociety.us/assets/imgs/SECRET_SOCIETY_MAIN.jpg" width="300" height="172" alt="The Secret Society"/>
                          <div>
                            <p>Hello ${user.first_name} ${user.last_name},</p>
                            <p>Thank you for ${trans.description}.</p>
                            <h3>Purchase Information</h3>
                            <h4>Transaction ID: ${trans.charge_id}</h4>
                            <h4>Description: ${trans.description}</h4>
                            <h4>Amount Paid: $${move_decimal(trans.amount, -2)} ${trans.currency.toUpperCase()}</h4>
                            <h4>Last 4 Digits on CC: ${trans.last4}</h4>
                            <h4>Status: ${trans.status}</h4>
                            <p>We look forward to having you as apart of our collective. <br/>
                            Please make sure you opt-in to our emails so that you can receive our communications and stay up-to-date with the latest events and happenings within our network.<br/>
                            To enrich the quality of our network, we encourage you to invite others in your circle who you feel are of the same caliber as you. <br/>
                            We strive to continue to grow and cultivate a community worthy of your participation.  See you soon.</p>
                          </div>
                      </div>
                    </body>
                  </html>`
                    }

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log('Email Failed: ' + error)
                        } else {
                            console.log('Email sent: ' + info.response)
                        }
                    })
                })

                res.status(200).json({ success: true, message: 'Transaction successful!', data: item })
            })
            .catch(error => {
                console.log("Transaction Error: ", error);
                res.status(400).json({ success: false, message: error })
            })
    },

    // Update a item
    updateItem: (req, res) => {},

    // Delete a item
    deleteItem: (req, res) => {},

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
                res.json({ status: true, message: 'Transaction found.', data: item })
            } else {
                res.json({ status: false, message: 'Transaction does not exists.' })
            }
        })
    },

    getCustomerTransactions: (req, res) => {
        var id = req.params.id
        Item.findAll({
            where: { customer_id: id }
        }).then(item => {
            if (item) {
                res.json({ status: true, message: 'Transactions found.', data: item })
            } else {
                res.json({ status: false, message: 'Transaction does not exists.' })
            }
        })
    }
}