const { Schema, model } = require('mongoose')
let Course = new Schema({
  name: { type: String, required: true },
  session: [String]
})
let branchSchema = new Schema({
  courses: [Course],
  name: { type: String, required: true }
})

module.exports = model('branch', branchSchema)
