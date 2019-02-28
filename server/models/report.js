let { Schema, model } = require('mongoose')

const Question = new Schema({
  n: Number,
  answer: {
    type: String,
    enum: ['', 'a', 'b', 'c', 'd'],
    default: ''
  }
})
const Report = new Schema({
  status: Number,
  testID: String,
  branch: String,
  course: String,
  totQues: Number,
  totTime: Number,
  username: String,
  password: String,
  questions: [Question]
})

module.exports = model('Report', Report)
