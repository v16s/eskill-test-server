let { model, Schema } = require('mongoose')
let Test = new Schema({
  testID: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  questions: { type: Number, required: true },
  time: { type: Number, required: true }
})
module.exports = model('Test', Test)
