const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const router = require('express').Router()
const path = require('path')
const { Question } = require('../models')
const crypto = require('crypto')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
router.use(express.static('./public'))

const mongoURI = 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test'
const conn = mongoose.createConnection(mongoURI)
let gfs

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('questions')
})

let storage = new GridFsStorage({
  url: 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, async (err, buf) => {
        if (err) {
          return reject(err)
        }
        let n = await Question.countDocuments({
          branch: req.body.branch,
          course: req.body.course
        }).exec()

        const filename = `${req.body.branch}_${req.body.course}_${n}`
        console.log(req.body)
        const fileInfo = {
          filename: filename,
          bucketName: 'questions'
        }
        resolve(fileInfo)
      })
    })
  }
})

let upload = null

storage.on('connection', db => {
  upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    }
  }).single('Image')
})

function checkFileType (file, cb) {
  const ficonstypes = /jpeg|jpg|png|gif/

  const extname = ficonstypes.test(
    path.extname(file.originalname).toLowerCase()
  )

  const mimetype = ficonstypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

router.post('/addQuestion', async function (req, res) {
  upload(req, res, async err => {
    let n = await Question.countDocuments({
      branch: req.body.branch,
      course: req.body.course
    }).exec()
    let question = new Question({
      branch: req.body.branch,
      course: req.body.course,
      title: req.body.title,
      definition: req.body.definition,
      n: n,
      answer: req.body.answer
    })
    question.save(err => {
      res.sendStatus(200)
    })
  })
})
router.get('/question/:branch/:course/:n/image', async (req, res) => {
  try {
    let { branch, course, n } = req.params
    gfs.files.findOne({ filename: `${branch}_${course}_${n}` }, (err, file) => {
      if (
        file &&
        (file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png' ||
          file.contentType === 'image/jpg')
      ) {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename)

        readstream.pipe(res)
      } else {
        res.status(400).send({ success: false, err: 'image not found' })
      }
    })
  } catch (err) {
    console.log(err)
  }
})
router.get('/question/:branch/:course/:n', async (req, res) => {
  try {
    let { branch, course, n } = req.params
    let question = await Question.findOne({ branch, course, n })
    res.json(question)
  } catch (err) {
    console.log(err)
  }
})
router.get('/questions/:branch/:course', async (req, res) => {
  try {
    let questions = await Question.find(req.params)
    res.json({ success: true, questions })
  } catch (err) {}
})

router.post('/editQuestion', async (req, res) => {
  let { branch, course, n, title, definition, answer } = req.body
  try {
    gfs.deleteOne(
      {
        filename: `${branch}_${course}_${n}`
      },
      function (err, gridStore) {
        if (err) return handleError(err)
        console.log('success')
        upload(req, res, async err => {
          let n = await Question.countDocuments({
            branch: req.body.branch,
            course: req.body.course
          }).exec()
          let question = new Question({
            branch: req.body.branch,
            course: req.body.course,
            title: req.body.title,
            definition: req.body.definition,
            n: n,
            answer: req.body.answer
          })
          question.save(err => {
            res.sendStatus(200)
          })
        })
      }
    )
  } catch (err) {}
})
module.exports = router
