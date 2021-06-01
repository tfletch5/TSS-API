// Get express
const server = require('express')(),
    cors = require('cors'),
    morgan = require('morgan'),
    parser = require('body-parser'),
    multer = require('multer')

require('dotenv').config()

var PORT = process.env.SERVER_PORT
var ENV = process.env.ENV

// Multer Settings for file upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        // console.log('Original Name: ', file)
        cb(null, file.fieldname + '-' + Date.now())
    }
})

module.exports = upload = multer({ storage: storage })

// Access Control
server.use(cors())

// Parse body content
server.use(parser.json())
server.use(parser.urlencoded({ extended: false }))

// Get Morgan and log requested routes
server.use(morgan('dev'))

server.get('/', (req, res) => res.json({ status: 'success', message: 'Welcome to TSS API' }))

// Set api route path
server.use('/', require('./modules'))

// Start server
server.listen(PORT, () => {
    console.log(`Server running in ${ENV} on port: ${PORT}`)
})