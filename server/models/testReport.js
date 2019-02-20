var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var createReportSchema = new mongoose.Schema({
  status: { type: Number, required: true }
})
module.exports = mongoose.model('testReport', createReportSchema)
