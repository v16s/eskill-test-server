let express = require('express')
let router = express.Router()

const passport = require('../config/passport')

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

router.get(
  '/admin',
  passport.authenticate('admin', { session: false }),
  function (req, res) {
    var token = getToken(req.headers)
    if (token) {
      res.status(200).send({ success: true, user: req.user })
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  }
)
router.get(
  '/student',
  passport.authenticate('student', { session: false }),
  function (req, res) {
    console.log(req.user)
    var token = getToken(req.headers)
    if (token) {
      res.status(200).send({ success: true, user: req.user })
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  }
)

module.exports = router
