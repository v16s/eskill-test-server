var mongoose = require('mongoose')
var passport = require('passport')
var settings = require('../config/settings')
require('../config/passport')(passport)
var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../models/user')
var Test = require('../models/createTest')
var Report = require('../models/testReport')
var app = express()
const axios = require('axios')

// axios.get('createTest/:testID/:totTime', function (req, res) {
//   db.createtests.findOne(
//     {
//       testID: '1'
//     },
//     {
//       totTime: 1
//     }
//   )
// })

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

router.post('/updatetime', function (req, res) {
  let { regNumber, totTime } = req.body
  if (!totTime || !regNumber) {
    res.json({ success: false, msg: 'Please pass values for the fields.' })
  } else {
    Report.findOne({ regNumber: req.body.regNumber }, (err, doc) => {
      doc.totTime = totTime
      console.log(doc.totTime)
      doc.save(function (err) {
        if (err) {
          return res.json({ success: false, msg: 'Test already exists.' })
        }
        res.json({ success: true, msg: 'Successful created new user.' })
      })
    })
  }
})

router.post('/gettime', function (req, res) {
  let { regNumber, testID } = req.body
  if (!testID || !regNumber) {
    res.json({ success: false, msg: 'couldnt retrieve.' })
  } else {
    Report.findOne({ testID: req.body.testID }, (err, doc) => {
      res.send({ totTime: doc.totTime })
    })
  }
})

router.post('/login', function (req, res) {
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
module.exports = router
