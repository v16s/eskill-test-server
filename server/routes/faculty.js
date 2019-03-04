let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

router.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = router
