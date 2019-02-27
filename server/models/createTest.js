var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var createTestSchema = new mongoose.Schema({
  testID: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  totQues: { type: Number, required: true },
  totTime: { type: Number, required: true }
})
module.exports = mongoose.model('createTest', createTestSchema)
