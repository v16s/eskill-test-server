const { Schema, model } = require('mongoose')
let Options = new Schema({
  1: String,
  2: String,
  3: String,
  4: String
})
let question = new Schema({
  branch: String,
  course: String,
  title: String,
  definition: String,
  n: Number,
  answer: Number,
  options: Options
})

module.exports = model('Question', question)
