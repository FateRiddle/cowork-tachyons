var router = require('express').Router()

router.use('/api', require('./api'))

router.use('/api', require('./auth'))

module.exports = router
