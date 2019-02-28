let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

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
// router.post('/addCourse', function (req, res) {
//   let { name, session } = req.body
//   if (!name || !session) {
//     res.json({ success: false, msg: 'Please pass values for the fields.' })
//   } else {
//     var newCourse = new Course(req.body)
//     newCourse.save(function (err, newC) {
//       if (err) {
//         return res.json({ success: false, msg: 'Branch already exists.' })
//       }
//       res.json({ success: true, branch: newC })
//     })
//   }
// })
router.get('/tests', (req, res) => {
  Test.find({ testID: { $in: req.user.tests } }, (err, tests) => {
    if (err) {
      res.json({ success: false, err })
    }
    res.json({ success: true, tests })
  })
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
  User.findOne({ regNumber: req.user.regNumber }, (err, _user) => {
    let _test = new Test(req.body)
    _user.tests.push(_test.testID)
    _user.markModified('tests')
    _test.save(function (err, test) {
      if (err) {
        res.json({ success: false, err })
      }
      _user.save((err, user) => {
        res.json({ success: true, test, user })
      })
    })
  })
})

module.exports = router
