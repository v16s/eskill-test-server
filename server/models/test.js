let { model, Schema } = require('mongoose')
let Test = new Schema({
  testID: { type: String, required: true },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  questions: { type: Number, required: true },
  time: { type: Number, required: true },
  status: { type: Number, default: 0 }
})
Test.index({ department: 1, branch: 1, testID: 1 }, { unique: true })
module.exports = model('Test', Test)
