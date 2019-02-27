var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var createReportSchema = new mongoose.Schema({
  status: { type: Number, required: true },
  regNumber: { type: Number, required: true, unique: true },
  testID: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  totQues: { type: Number, required: true },
  totTime: { type: Number, required: true },
  startTime: { type: Number, required: true }
})
module.exports = mongoose.model('testReport', createReportSchema)
