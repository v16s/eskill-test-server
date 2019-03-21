let router = require('express').Router()
let mongoose = require('mongoose')
let { Report, Question } = require('../models')
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
    let { _id } = await File.findOne({ filename })
    gfs.openDownloadStream(_id).pipe(res)
  } catch (err) {
    err
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
module.exports = router
