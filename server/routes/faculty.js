let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')
let { reject } = require('lodash')

router.post('/createTest', function (req, res) {
  User.findOne({ regNumber: req.body.regNumber }, async (err, _user) => {
    Test.findOne({ testID: req.body.testID }, function (err, _test) {
      _user.tests.push(_test)
      _user.markModified('tests')
      _user.save(function (err, user) {
        if (err) {
          return res.json({ success: false, msg: err })
        }
        res.json({ success: true, user: user })
      })
    })
  })
})
router.post('/deleteTest', function (req, res) {
  User.findOne({ regNumber: req.body.regNumber }, async (err, _user) => {
    Test.findOne({ testID: req.body.testID }, function (err, _test) {
      _user.tests = reject(_user.test, d => d == _test)
      _user.markModified('tests')
      _user.save(function (err, user) {
        if (err) {
          return res.json({ success: false, msg: err })
        }
        res.json({ success: true, user: user })
      })
    })
  })
})
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
module.exports = router
