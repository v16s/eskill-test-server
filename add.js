let mongoose = require('mongoose')
const randomNumber = require('random-number')
mongoose.Promise = require('bluebird')
mongoose
  .connect(
    require('./config.json').dburl,
    { promiseLibrary: require('bluebird'), useNewUrlParser: true }
  )
  .then(() => {
    Array.from(Array(parseInt(200))).map(async (k, i) => {
      let options = {
        1: answer(),
        2: answer(),
        3: answer(),
        4: answer()
      }
      let question = new Question({
        branch: 'hie',
        course: 'hello',
        n: i,
        title: make(),
        options,
        description: desc(),
        answer: 2
      })
      await question.save()
      console.log(i)
    })
  })
  .catch(err => console.error(err))

const { Question } = require('./server/models')

function randomItem (array) {
  const randomIndex = randomNumber({
    min: 0,
    max: array.length - 1,
    integer: true
  })
  return array[randomIndex]
}

let make = () => {
  const dragonSizes = ['big', 'medium', 'tiny']
  const dragonAbilities = ['time', 'fire', 'ice', 'lightning']
  return (
    randomItem(dragonSizes) +
    ' ' +
    randomItem(dragonAbilities) +
    ' ' +
    ' experiment'
  )
}
let desc = () => {
  const dragonSizes = ['big', 'medium', 'tiny']
  const dragonAbilities = ['time', 'fire', 'ice', 'lightning']
  const dragonAbilities2 = ['time', 'fire', 'ice', 'lightning']
  const dragonAbilities3 = ['time', 'fire', 'ice', 'lightning']
  const dragonAbilities4 = ['time', 'fire', 'ice', 'lightning']
  const dragonAbilities5 = ['time', 'fire', 'ice', 'lightning']
  return (
    randomItem(dragonSizes) +
    ' ' +
    randomItem(dragonAbilities) +
    ' ' +
    randomItem(dragonAbilities2) +
    ' ' +
    randomItem(dragonAbilities3) +
    ' ' +
    randomItem(dragonAbilities4) +
    ' ' +
    randomItem(dragonAbilities5) +
    ' ' +
    ' description'
  )
}
let answer = () => {
  const dragonSizes = ['big', 'medium', 'tiny', 'smol', 'lul']
  return randomItem(dragonSizes)
}
