var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Book = require('../models/Book.js')
var passport = require('passport')
require('../config/passport')(passport)

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

/* GET ALL BOOKS */
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

/* SAVE BOOK */
router.post('/', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  var token = getToken(req.headers)
  if (token) {
    Book.create(req.body, function (err, post) {
      if (err) return next(err)
      res.json(post)
    })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

module.exports = router
