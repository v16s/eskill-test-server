let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')
let { reject } = require('lodash')

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

router.post('/editCourse', async function (req, res) {
  let { name, courseName, newCourseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.editCourse(courseName, newCourseName)
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/removeCourse', async function (req, res) {
  let { name, courseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.removeCourse(courseName)
    res.json({ success: true, branch })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
})

router.post('/addSession', async function (req, res) {
  let { name, courseName, session } = req.body
  try {
    let branch = await Branch.findOne({
      name
    })
    let course = findIndex(branch.courses, { name: courseName })
    if (course != -1) {
      branch.courses[course].session.push(session)
      await branch.save()
      res.json({ success: true, branch })
    } else {
      res.json({ success: false }, err)
    }
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/editSession', async function (req, res) {
  let { name, courseName, session, newSesName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.editSession(courseName, session, newSesName)
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/removeSession', async function (req, res) {
  let { name, courseName, session } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.removeSession(courseName, session)
    res.json({ success: true, branch })
  } catch (err) {
    console.log(err)
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

router.post('/addfaculty', function (req, res) {
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
router.post('/removefaculty', function (req, res) {
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
router.post('/removestudent', function (req, res) {
  Report.deleteOne({ username: req.body.username }, async (err) => {
    if (err) {
      return res.json({ success: false, msg: err })
    }
    res.json({ success: true })
  })
})

module.exports = router
