var mongoose = require('mongoose')
var createTestSchema = new mongoose.Schema({
  chooseQue: String,
  branch: { type: String, required: true },
  course: { type: String, required: true },
  totQues: { type: Number, required: true },
  totTime: { type: Number, required: true }
})
module.exports = mongoose.model('createTest', createTestSchema)
