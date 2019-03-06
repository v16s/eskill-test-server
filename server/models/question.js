const { Schema, model } = require('mongoose')
// let Image = new Schema({
//     data: Buffer,
//     contentType: String,
//     mimeType: String
// })

let question = new Schema({
  branch: String,
  course: String,
  title: String,
  definition: String,
  image: String,
  n: Number
})

module.exports = model('Question', question)
