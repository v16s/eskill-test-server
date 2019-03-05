let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

router.get('/', (req, res) => {
  res.sendStatus(200)
})
router.get('/time', (req, res) => {
  Report.findOne({ username: req.user.username }, (err, report) => {
    if (err) {
      res.json({ success: false, err })
    } else {
      res.json({ success: true, time: report.time })
    }
  })
})
router.post('/updatetime', (req, res) => {
  Report.findOne({ username: req.user.username }, (err, report) => {
    if (report.time > req.body.time) {
      report.time = req.body.time
      report.save(function (err, rep) {
        if (err) {
          res.json({ success: false, err })
        } else {
          res.json({ success: true, rep })
        }
      })
    } else res.json({ success: false, err: ' Time is invalid' })
  })
})
module.exports = router
