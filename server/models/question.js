const { Schema, model } = require('mongoose')

let question = new Schema({
  branch: String,
  course: String,
  title: String,
  definition: String,
  n: Number,
  answer: String
})

module.exports = model('Question', question)
