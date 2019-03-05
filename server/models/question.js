const { Schema, model } = require('mongoose')
// let Image = new Schema({
//     data: Buffer,
//     contentType: String,
//     mimeType: String
// })

let question = new Schema({
  branch: String,
  course: String,
  n: Number,
  title: String,
  definition: String,
  image: String
})

module.exports = model('question', question)
