let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')
let { findIndex, reject } = require('lodash')

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
  Branch.deleteOne({ name }, err => {
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
    await branch.addCourse(courseName)
    res.json({ success: true, branch })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
})

router.post('/editCourse', async function (req, res) {
  let { name, courseName, newCourseName } = req.body
  try {
    let branch = await Branch.findOne({ name })
    await branch.editCourse(courseName, newCourseName)
    console.log(branch)
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

// router.post('/editSession', async function (req, res) {
//   let { name, courseName, sessionName, newSessionName } = req.body
//   try {
//     let branch = await Branch.findOne({ name })
//     let course = findIndex(branch.courses, { name: courseName })
//     if (course != -1) {
//       let sName = findIndex(branch.courses[course], { name: sessionName })
//       if (sName != -1) {
//         branch.courses[course].session[sName].set({ name: newSessionName })
//         await branch.save()
//         res.json({ success: true, branch })
//       } else {
//         res.json({ success: false }, err)
//       }
//     } else {
//       res.json({ success: false }, err)
//     }
//   } catch (err) {
//     res.json({ success: false, err })
//   }
// })

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
