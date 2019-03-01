let router = require('express').Router()
let { Global } = require('../models')

router.get('/global', (req, res) => {
  Global.findOne({ id: 0 }, (err, doc) => {
    console.log(doc)
    res.send(doc)
  })
})
module.exports = router
