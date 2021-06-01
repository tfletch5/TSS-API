const Item = require('./user_model.js');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');

const db = require('../../database.js');

const getCurrent = () => {
    return moment().format("L")
}

module.exports = {
    // Update a item
    updateItem: (req, res) => {
        const {id} = req.params;
        const updates = {};

        for (var ops in req.body) {
            updates[ops] = ops != 'password' ? req.body[ops] : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        }

        Item.find({
                where: { id: id },
                attributes: { exclude: ['ambassador_id', 'code', 'password', 'createAt', 'updateAt'] }
            })
            .then(item => {
                if (item) return item.updateAttributes(updates)
            })
            .then(updated => {
                if (updated) {
                    res.status(200).json({ success: true, message: 'User updated.', data: updated })
                } else {
                    res.status(400).json({ success: false, message: 'User does not exists.' })
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
                            if (deleted) res.status(200).json({ status: true, message: 'User deleted!' })
                        })
                        .catch(error => res.status(400).send(error))
                } else {
                    res.status(400).json({ status: false, message: 'User does not exists!' })
                }
            })
    },

    // Get all items
    getAll: (req, res) => {
        const sql = `SELECT u.*, l.name as location, CONCAT_WS(' ', a.first, a.last) as ambassador 
            FROM users u 
            LEFT JOIN locations l ON l.id = u.location_id
            LEFT JOIN ambassadors a ON a.id = u.ambassador_id`;

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            res.json({ item_count: results.length, items: results })
        })
    },

    // Get a specific item
    getItem: (req, res) => {
        const {id} = req.params;
        const sql = `SELECT u.id, u.code, u.first_name, u.last_name, u.address, u.city, u.state, u.zip, u.email, u.phone, u.birthday, u.userlevel, l.name as location, CONCAT_WS(' ', a.first, a.last) as ambassador 
            FROM users u 
            LEFT JOIN locations l ON l.id = u.location_id
            LEFT JOIN ambassadors a ON a.id = u.ambassador_id
            WHERE u.id = ${id}`

        db.sequelize.query(sql).then(users => {
            var results = users[0]
            if (results.length > 0) {
                res.json({ status: true, message: 'User found.', data: results })
            } else {
                res.json({ status: false, message: 'User does not exists.' })
            }
        })
    },

    // Get Events by User
    getEvent: (req, res) => {
        const {id} = req.params;
        const sql = `SELECT e.*, l.name as location, p.name as place, p.address as place_address, p.city as place_city, p.state as place_state, p.zip as place_zip, p.phone as place_phone, p.website, i.url 
            FROM attendees a 
            LEFT JOIN events e ON e.id = a.event_id
            LEFT JOIN locations l ON l.id = e.location_id
            LEFT JOIN places p ON p.id = e.place_id
            LEFT JOIN images i ON i.uid = e.event_flyer
            WHERE a.user_id = ${id} AND UNIX_TIMESTAMP(STR_TO_DATE(e.event_date, '%m/%d/%Y')) >= UNIX_TIMESTAMP()
            ORDER BY STR_TO_DATE(e.event_date, '%m/%d/%Y') DESC`

        db.sequelize.query(sql).then(events => {
            const results = events[0]
            console.log(results);
            if (results.length > 0) {
                res.json({ success: true, message: 'Events found.', data: results })
            } else {
                res.json({ success: false, message: 'Events does not exists.' })
            }
        })
    },

    getMembership: (req, res) => {
        const {id} = req.params;
        const sql = `SELECT membership_id FROM members WHERE user_id = ${id}`
        db.sequelize.query(sql).then(membership => {
            var results = membership[0]
            if (results.length > 0) {
                res.json({ success: true, message: 'Membership found.', data: results[0] })
            } else {
                res.json({ success: false, message: 'Mmbership does not exists.' })
            }
        })
    }
}