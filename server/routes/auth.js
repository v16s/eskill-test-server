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

router.get('/createTest', function (req, res) {
  let { totTime, testID } = req.body
  if (!totTime || !testID) {
    res.json({ success: false, msg: 'Time doesnt exist for test.' })
  } else {
    var TestGet = new Test(req.body)
    // save the user
    TestGet.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Test already exists.' })
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
    newTest.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Test already exists.' })
      }
      res.json({ success: true, msg: 'Successful created new user.' })
    })
  }
})

router.post('/testReport', function (req, res) {
  let { status } = req.body
  if (!status) {
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
