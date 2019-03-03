var JwtStrategy = require('passport-jwt').Strategy

var ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
let { User, Report } = require('../models')
var settings = require('../config/settings') // get settings file

let passport = require('passport')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
opts.secretOrKey = settings.secret
passport.use(
  'admin',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, { level: 0 })
      }
    })
  })
)
passport.use(
  'student',
  new JwtStrategy(opts, function (jwt_payload, done) {
    Report.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
)
passport.use(
  'faculty',
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ regNumber: jwt_payload.regNumber }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, { level: 0 })
      }
    })
  })
)
module.exports = passport
