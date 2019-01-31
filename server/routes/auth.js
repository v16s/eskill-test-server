var mongoose = require('mongoose')
var passport = require('passport')
var settings = require('../config/settings')
require('../config/passport')(passport)
var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../models/user')

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
            res.json({ success: true, token: 'JWT ' + token })
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
