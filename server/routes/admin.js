let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

router.post('/registerfc', async function (req, res) {
  var newUser = new User({
    ...req.body,
    department: req.user.department,
    campus: req.user.campus,
    tests: []
  })
  // save the user
  try {
    await newUser.save()
    res.status(200).send(newUser)
  } catch (err) {
    res.send({ err })
  }
})
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
router.post('/addCourse', async function (req, res) {
  let { name, courseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    branch.courses.push({ name: courseName, session: [] })
    await branch.save()
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
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
router.post('/testReport', function (req, res) {
  let { username, testID } = req.body
  Test.findOne({ testID }, (err, test) => {
    console.log(test)
    console.log(username)
  })
  res.sendStatus(200)
})
router.post('/createTest', function (req, res) {
  User.findOne({ regNumber: req.user.regNumber }, async (err, _user) => {
    let _test = new Test(req.body)
    _user.tests.push(_test)
    _user.markModified('tests')
    try {
      console.log(_user.tests)
      let test = await _test.save()
      let user = await _user.save()
      let reports = await Report.insertMany(
        Array.from(Array(parseInt(req.body.number))).map((k, i) => {
          return {
            ...req.body,
            questions: [],
            username: `${req.body.testID}_student_${i}`
          }
        })
      )
      res.json({ success: true, test, user })
    } catch (err) {
      res.json({ success: false, err })
    }
  })
})

module.exports = router
