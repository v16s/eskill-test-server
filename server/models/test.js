let { model, Schema } = require('mongoose')
let Test = new Schema({
  testID: { type: String, required: true },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  questions: { type: Number, required: true },
  time: { type: Number, required: true }
})
Test.index({ department: 1, branch: 1, testID: 1 }, { unique: true })
module.exports = model('Test', Test)
