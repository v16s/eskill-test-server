let router = require('express').Router()

let Test = require('../models/createTest')

let Report = require('../models/testReport')
router.post('/testReport', function (req, res) {
  let { username, testID } = req.body
  Test.findOne({ testID }, (err, test) => {
    console.log(test)
    console.log(username)
  })
  res.sendStatus(200)
})
router.post('/createTest', function (req, res) {
  let { branch, course, totTime, totQues, testID } = req.body
  if (!branch || !course || !totQues || !totTime || !testID) {
    res.json({ success: false, msg: 'Please pass values for the fields.' })
  } else {
    var newTest = new Test(req.body)
    // save the user
    newTest.save(function (err, newT) {
      if (err) {
        return res.json({ success: false, msg: 'Test already exists.' })
      }
      res.json({ success: true, test: newT })
    })
  }
})

module.exports = router
