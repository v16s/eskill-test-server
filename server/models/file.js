const mongoose = require('mongoose')
const FileSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'questions.files' }
)
const File = mongoose.model('File', FileSchema, 'questions.files')
module.exports = File
