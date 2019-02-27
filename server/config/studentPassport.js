let JwtStrategy = require('passport-jwt').Strategy

let ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
let TestReport = require('../models/testReport')
// get settings file
var settings = require('../config/settings')
module.exports = function (passport) {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = settings.secret
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      TestReport.findOne({ regNumber: jwt_payload.regNumber }, function (
        err,
        user
      ) {
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
}
