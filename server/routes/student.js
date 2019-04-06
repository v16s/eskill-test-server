let router = require('express').Router()
let mongoose = require('mongoose')
let { Report, Question, File } = require('../models')

let gfs
mongoose.connection.on('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: 'questions'
  })
})
router.get('/', (req, res) => {
  console.log('correct end point')
  res.sendStatus(200)
})
router.get('/time', (req, res) => {
  Report.findOne({ username: req.user.username }, (err, report) => {
    if (err) {
      res.json({ success: false, err })
    } else {
      res.json({ success: true, time: report.time })
    }
  })
})

router.get('/question/:branch/:course/:n/image', async (req, res) => {
  let filename = `${req.params.branch}_${req.params.course}_${req.params.n}`
  try {
    console.log(filename)
    let { _id } = await File.findOne({ filename })
    let stream = gfs.openDownloadStream(_id)
    let chunks = []
    stream.on('data', function (chunk) {
      chunks.push(chunk)
      console.log('chunk:', chunk.length)
    })
    stream.on('end', function () {
      var result = Buffer.concat(chunks)
      console.log('final result:', result.length)
      res.send({ image: result.toString('base64') })
    })
  } catch (err) {
    res.send('none')
  }
})
router.post('/update', async (req, res) => {
  try {
    let { username, questions } = req.body
    let student = await Report.findOne({ username })
    student.questions = questions
    await student.save()
    res.status(200).send({ success: true, questions })
  } catch (err) {
    res.status(400).send({ success: false, err })
  }
})
router.get('/question/:branch/:course/:n', async (req, res) => {
  try {
    let { branch, course, n } = req.params
    let question = await Question.findOne({ branch, course, n })
    res.json(question)
  } catch (err) {
    err
  }
})
router.post('/updatetime', async (req, res) => {
  try {
    let report = await Report.findOneAndUpdate(
      { username: req.user.username, time: { $gt: req.body.time } },
      req.body,
      { new: true }
    )
    res.json({ success: true, report })
  } catch (err) {
    res.json({ success: false, err: ' Time is invalid' })
  }
})
router.post('/edit', async (req, res) => {
  console.log(req.body)

  try {
    let report = await Report.findOneAndUpdate(
      { username: req.user.username },
      req.body,
      { new: true }
    )
    res.json({ success: true, report })
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, err })
  }
})

router.post('/endtest', async function (req, res) {
  try {
    let { username, course, branch } = req.body
    let student = await Report.findOne({ username, course, branch })
    student.status = 1
    await student.save()
    res.status(200).send({ success: true })
  } catch (err) {
    res.status(400).send({ err })
  }
})
module.exports = router
