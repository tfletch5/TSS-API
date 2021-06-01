const router = require('express').Router(),
  User = require('./users/user_model'),
  Survey = require('./surveys/survey_model'),
  Item = require('./ambassadors/ambassador_model'),
  Location = require('./locations/location_model'),
  Member = require('./members/member_model'),
  glob = require('glob'),
  bcrypt = require('bcrypt-nodejs'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  path = require('path'),
  db = require('../database.js'),
  routes = glob.sync('./modules/**/*_routes.js'),
  stripe = require('stripe')(process.env.STRIPE_TEST_KEY),
  tokenList = {}

// Code Search
router.get('/code/:id', (req, res) => {
  Item.find({
    where: {
      code: req.params.id
    }
  })
  .then((code) => {
    if (code) {
      var ambassador = {
        id: code.id,
        code: code.code
      }
      res.status(200).json({ success: true, message: 'Code found!', data: ambassador })
    } else {
      res.status(201).json({ success: false, message: 'Code not found!' })
    }
  })
})

router.get('/getlocations', (req, res) => {
  Location.findAll().then(items => {
    res.json({ item_count: items.length, items: items })
  })
})

// User Sign up
router.post('/register', (req, res) => {
  var user = {
    code: req.body.code,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    userlevel: 'user',
    location_id: req.body.location_id,
    ambassador_id: req.body.ambassador_id
  }

  User.find({
    where: {
      email: user.email
    }
  }).then((getuser) => {
    if (getuser) {
      res.status(400).json({ success: false, message: 'User already exist.' })
    } else {
      var createcustomer = { email: user.email, description: `TSS Customer Account for ${user.first_name} ${user.last_name}` }
      stripe.customers.create(createcustomer, function(err, customer) {
        if (err) return res.status(201).json({ success: false, message: 'Customer not created.' })
        user.customer_id = customer.id

        User.create(user)
          .then(u => {
            Survey.create({ user_id: u.id })

            var createsubscription = { customer: u.customer_id, items: [{ plan: 'plan_EQHuo9TzHjUFST' }] }
            stripe.subscriptions.create(createsubscription, function(error, subscription) {
              if (error) return res.status(201).json({ success: false, message: 'Subscription not created.' })

              const token = jwt.sign({ 'user_id': user.id }, process.env.JWTSECRET, { expiresIn: 43200 })
              const refreshToken = jwt.sign({ 'user_id': user.id }, process.env.JWTREFRESHSECRET, { expiresIn: 86400 })

              var member = {
                code_id: u.ambassador_id,
                user_id: u.id,
                membership_id: 11,
                subscription_id: subscription.id,
                status: 'free'
              }
              Member.create(member)

              Location.findOne({
                where: { id: u.location_id }
              }).then((loc) => {
                var locname = loc.dataValues
                var data = {
                  user: {
                    id: u.id,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    address: u.address,
                    city: u.city,
                    state: u.state,
                    zip: u.zip,
                    email: u.email,
                    phone: u.phone,
                    userlevel: u.userlevel,
                    customer_id: u.customer_id,
                    location: u.location_id,
                    location_name: locname.name
                  },
                  token: token,
                  refreshToken: refreshToken
                }
                tokenList[refreshToken] = data
                return res.status(200).send({ success: true, message: 'User created', data: data })
              })
            })
        })
      })
    }
  })
})

// Authenticate user
router.put('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (email && password) {
    const sql = `SELECT u.id as userid, u.first_name, u.last_name, u.address, u.city, u.state, u.zip, u.email, u.phone, u.password, u.userlevel, u.customer_id, u.location_id, l.name as location_name FROM users u LEFT JOIN locations l ON l.id = u.location_id WHERE u.email = '${email}'`

    db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT }).then(u => {
      if (u.length != 0) {
        const user = u[0]

        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ 'user_id': user.id }, process.env.JWTSECRET, { expiresIn: 43200 })
          const refreshToken = jwt.sign({ 'user_id': user.id }, process.env.JWTREFRESHSECRET, { expiresIn: 86400 })

          const data = {
            user: {
              id: user.userid,
              first_name: user.first_name,
              last_name: user.last_name,
              address: user.address,
              city: user.city,
              state: user.state,
              zip: user.zip,
              email: user.email,
              phone: user.phone,
              userlevel: user.userlevel,
              customer_id: user.customer_id,
              location: user.location_id,
              location_name: user.location_name
            },
            token: token,
            refreshToken: refreshToken
          }
          tokenList[refreshToken] = data
          res.status(200).json({ success: true, message: 'Logged in successfully.', data: data })
        } else {
          res.status(201).json({ success: false, message: 'Password invalid', data: { success: false } })
        }
      } else {
        res.status(201).json({ success: false, message: 'Email not found!!' })
      }
    })
  } else {
    res.status(201).json({ success: false, message: 'Email/Password invalid!!' })
  }
})

router.post('/refreshtoken', (req, res) => {
    // refresh the damn token
    const item = req.body
        // if refresh token exists
    if ((item.refreshToken) && (item.refreshToken in tokenList)) {
        const token = jwt.sign({ 'user_id': item.id }, process.env.JWTSECRET, { expiresIn: 3600 })
        const response = { 'token': token }
            // update the token in the list
        tokenList[item.refreshToken].token = token
        res.status(200).json(response)
    } else {
        res.status(401).send('Invalid request')
    }
})

router.get('/images/:id', (req, res) => {
    var id = req.params.id
    Image.find({
        where: { uid: id }
    }).then(item => {
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg')
        fs.createReadStream(path.join('uploads', item.filename)).pipe(res)
    })
})

// check header or url parameters or post parameters for token
router.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token']

    if (token) {
        jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
            if (err) {
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.', error: err })
            } else {
                req.decoded = decoded; // if everything is good, save to request for use in other routes
                next()
            }
        })
    } else {
        // if there is no token return an error
        return res.status(401).send({ success: false, message: 'No token provided.' })
    }
})

router.post('/upload', upload.single('photo'), function(req, res) {
    if (!req.file) {
        return res.send({ success: false })
    } else {
        console.log('\x1b[32m', 'Starting the upload...')
        let newImage = new Image()
        newImage.uid = uid.randomUUID(12)
        newImage.filename = req.file.filename
        newImage.originalname = req.file.originalname
        newImage.path = req.file.path
        newImage.mimetype = req.file.mimetype
        newImage.size = req.file.size
        newImage.url = '/images/' + newImage.uid
        newImage.save().then(data => {
          const results = data.dataValues;
          if (results) {
            res.status(200).json({ success: true, message: 'Flyer uploaded', data: results })
          } else {
            res.status(400).json({ success: false, message: 'Flyer did not upload.' })
          }
        })
    }
})

// Load Available Routes
routes.forEach((route) => {
    var dir = route.split('/')
    router.use('/' + dir[2], require(route.replace('modules/', './')))
})

module.exports = router