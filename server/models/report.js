let { Schema, model } = require('mongoose')
const Question = require('./question')
function shuffle (array) {
  var currentIndex = array.length

  var temporaryValue

  var randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const Report = new Schema({
  status: { type: Number, default: 0 },
  testID: String,
  branch: String,
  course: String,
  nquestions: Number,
  time: Number,
  campus: String,
  department: String,
  username: String,
  password: String,
  questions: Array,
  name: String,
  email: String,
  regno: String
})

Report.pre('save', async function (next) {
  if (this.isNew) {
    let nq = await Question.countDocuments({
      branch: this.branch,
      course: this.course
    })
    if (this.nquestions <= nq) {
      nq = this.nquestions
    }
    console.log(nq, this.nquestions)
    let array = Array.from(Array(parseInt(nq))).map((k, i) => {
      return {
        n: i,
        answer: ''
      }
    })

    array = shuffle(array)
    array.slice(0, this.nquestions).map(k => {
      this.questions.push(k)
    })
    this.markModified('questions')
  }
  return next()
})

module.exports = model('Report', Report)
