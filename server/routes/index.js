let admin = require('./admin')
let auth = require('./auth')
let student = require('./student')
let coordinator = require('./coordinator')
let validate = require('./validate')
let global = require('./global')
let faculty = require('./faculty')
module.exports = {
  admin,
  auth,
  student,
  validate,
  global,
  faculty,
  coordinator
}
