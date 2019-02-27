let passport = require('passport')
let settings = require('../config/settings')
let studentPassport = passport
require('../config/passport')(passport)
require('../config/studentPassport')(studentPassport)

let express = require('express')
let jwt = require('jsonwebtoken')
let router = express.Router()
let User = require('../models/user')
let Test = require('../models/createTest')
let Report = require('../models/testReport')

router.post('/register', function (req, res) {
  let { regNumber, password, field, college, email, fullName } = req.body
  if (!regNumber || !password || !field || !college || !email || !fullName) {
    res.json({ success: false, msg: 'Please pass regNumber and password.' })
  } else {
    var newUser = new User(req.body)
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'regNumber already exists.' })
      }
      res.json({ success: true, msg: 'Successful created new user.' })
    })
  }
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

router.post('/testReport', function (req, res) {
  let {
    regNumber,
    status,
    branch,
    course,
    totTime,
    totQues,
    testID,
    startTime
  } = req.body
  if (
    !status ||
    !branch ||
    !course ||
    !totQues ||
    !totTime ||
    !testID ||
    !startTime ||
    !regNumber
  ) {
    res.json({ success: false, msg: 'Please pass values for the fields.' })
  } else {
    var newReport = new Report(req.body)
    // save the user
    newReport.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Test already exists.' })
      }
      res.json({ success: true, msg: 'Successful created new user.' })
    })
  }
})

router.post('/admin/login', function (req, res) {
  User.findOne(
    {
      regNumber: req.body.regNumber
    },
    function (err, user) {
      if (err) throw err

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        })
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret)
            // return the information including token as JSON
            res.json({ success: true, token: 'JWT ' + token, user: user })
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            })
          }
        })
      }
    }
  )
})
router.post('/student/login', function (req, res) {
  Report.findOne(
    {
      regNumber: req.body.regNumber
    },
    function (err, user) {
      if (err) throw err

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        })
      } else {
        if (user.password == req.body.password) {
          var token = jwt.sign(user.toJSON(), settings.secret)
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token, user: user })
        } else {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          })
        }
      }
    }
  )
})
module.exports = router
