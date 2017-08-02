// server/app.js
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const app = express()

const expressJwt = require('express-jwt')
const secret = 'djit9379'

app.use(cors())
// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression())

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))
app.use(
  '/api',
  expressJwt({ secret }).unless({ path: ['/api/auth/login', '/api/auth'] })
)
app.use(require('./routes'))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

module.exports = app
