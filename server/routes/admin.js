let router = require('express').Router()
let { Report, Branch, Test } = require('../models')

router.post('/addBranch', function (req, res) {
  let { name } = req.body

  let newBranch = new Branch(req.body)
  newBranch.save(function (err, newB) {
    if (err) {
      return res.json({ success: false, msg: err })
    }
    res.json({ success: true, branch: newB })
  })
})

router.post('/removeBranch', function (req, res) {
  let { name } = req.body
  Branch.remove({ name }, err => {
    console.log(err)
    res.sendStatus(200)
  })
})

router.post('/editBranch', function (req, res) {
  let { name, newName } = req.body
  Branch.updateOne({ name: name }, { $set: { name: newName } }, err => {
    console.log(err)
    res.sendStatus(200)
  })
})
router.post('/addCourse', function (req, res) {
  let { name, courseName, session } = req.body
  Branch.updateOne(
    { name },
    { $set: { courses: [{ name: courseName, session: session }] } },
    err => {
      console.log(err)
      res.sendStatus(200)
    }
  )
})

router.post('/testReport', function (req, res) {
  let { username, testID } = req.body
  Test.findOne({ testID }, (err, test) => {
    console.log(test)
    console.log(username)
  })
  res.sendStatus(200)
})
router.post('/createTest', function (req, res) {
  let _test = new Test(req.body)
  _test.save(function (err, test) {
    if (err) {
      return res.json({ success: false, err })
    }
    res.json({ success: true, test })
  })
})

module.exports = router
