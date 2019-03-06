let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')
let { findIndex, reject } = require('lodash')

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
      return res.json({ success: false, err })
    }
    res.json({ success: true, branch: newB })
  })
})

router.post('/removeBranch', function (req, res) {
  let { name } = req.body
  Branch.remove({ name }, err => {
    if (!err) {
      res.json({ success: true, name })
    } else {
      res.json({ success: false, err })
    }
  })
})

router.get('/branches', async (req, res) => {
  try {
    let branches = await Branch.find()
    res.json({ success: true, branches })
  } catch (err) {
    res.json({ success: false, err })
  }
})

router.post('/editBranch', async function (req, res) {
  let { name, newName } = req.body
  try {
    let branch = await Branch.updateOne(
      { name: name },
      { $set: { name: newName } }
    )
    res.json({ success: true, branch })
  } catch (err) {
    res.json({ success: false, err })
  }
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
    console.log(err)
    res.json({ success: false, err: err })
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
router.get('/faculties/:testID', async (req, res) => {
  try {
    let faculties = await User.find({
      isAdmin: 2,
      campus: req.user.campus,
      department: req.user.department,
      'tests.testID': { $in: [req.params.testID] }
    })
    res.json({ success: true, faculties })
  } catch (err) {
    res.json({ success: false, err })
  }
})
router.get('/allfaculties/:testID', async (req, res) => {
  try {
    let faculties = await User.find({
      isAdmin: 2,
      campus: req.user.campus,
      department: req.user.department,
      'tests.testID': { $nin: [req.params.testID] }
    })
    res.json({ success: true, faculties })
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
router.get('/reports/:testID', async (req, res) => {
  let { testID } = req.params
  try {
    let reports = await Report.find({ testID })
    res.json({ success: true, reports })
  } catch (err) {
    res.json({ success: false, err })
  }
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
            nquestions: req.body.questions,
            username: `${req.body.testID.replace(
              / /g,
              "+"
            )}_${i}`,
            password: Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 5)
          }
        })
      )
      res.json({ success: true, test, user })
    } catch (err) {
      res.json({ success: false, err })
    }
  })
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
                "+"
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
/**
 * coordinator = 1
 * faculty = 2
 */
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

router.post('/endtest', function (req, res) {
  Report.findOne(
    { username: req.body.username, testID: req.body.testID },
    async (err, user) => {
      user.status = 2
      user.save(function (err, user) {
        if (err) {
          return res.json({ success: false, msg: err })
        }
        res.json({ success: true, user: user })
      })
    }
  )
})

module.exports = router
