var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var UserSchema = new Schema({
  regNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  college: { type: String, required: true },
  field: { type: String, required: true },
  email: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  isAdmin: { type: Number, default: 0 }
})

UserSchema.pre('save', function (next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)