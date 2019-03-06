let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

router.get('/tests', (req, res) => {
  Test.find(
    { testID: { $in: req.user.tests.map(d => d.testID) } },
    (err, tests) => {
      if (err) {
        res.json({ success: false, err })
      } else {
        res.json({ success: true, tests })
      }
    }
  )
})

router.get('/reports/:testID', async (req, res) => {
  let { testID } = req.params
  try {
    let reports = await Report.find({ testID })
    res.json({ success: true, reports })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/removestudent', function (req, res) {
  Report.deleteOne({ username: req.body.username }, async err => {
    if (err) {
      return res.json({ success: false, msg: err })
    }
    res.json({ success: true })
  })
})

router.post('/updatepassword', function (req, res) {
  Report.findOne({ username: req.body.username }, async (err, user) => {
    user.password = req.body.password
    user.save(function (err, user) {
      if (err) {
        return res.json({ success: false, msg: err })
      }
      res.json({ success: true, user: user })
    })
  })
})

module.exports = router
