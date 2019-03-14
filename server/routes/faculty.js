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
router.post('/addstudent', function (req, res) {
  
  Report.findOne({}, async (err, rep) => {
    username = rep.username.split('_')
    username.reverse()
    let count = parseInt(username[0])
    try {
      await Report.insertMany(
        Array.from(Array(parseInt(req.body.number))).map((k, i) => {
          return {
            branch: rep.branch,
            testID: rep.testID,
            course: rep.course,
            nquestions: rep.nquestions,
            time: rep.time,
            questions: [],
            username: `${req.body.testID.replace(
              / /g,
              "_"
            )}_${i + count + 1}`,
            password: Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 5)
          }
        })
      )
      res.json({ success: true })
    } catch (err) {
      console.log(err)
      res.json({ success: false, err })
    }
  })
    .limit(1)
    .sort({ $natural: -1 })
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
