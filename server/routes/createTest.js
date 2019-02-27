var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var createTest = require('../models/createTest.js')
var passport = require('../config/passport')

let getToken = headers => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

router.get('/', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  var token = getToken(req.headers)
  if (token) {
    res.status(200).send({ success: true, user: req.user })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

router.post('/', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  var token = getToken(req.headers)
  if (token) {
    createTest.create(req.body, function (err, post) {
      if (err) {
        return res.send(err)
      }
      res.json(post.body)
    })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

module.exports = router
