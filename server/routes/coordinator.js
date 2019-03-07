const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const router = require('express').Router()
const path = require('path')
const { Question } = require('../models')
const GridFsStorage = require('multer-gridfs-storage')
let gfs
router.use(express.static('./public'))
const FileSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'questions.files' }
)
const File = mongoose.model('File', FileSchema, 'questions.files')

mongoose.connection.on('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: 'questions'
  })
})

let storage = new GridFsStorage({
  url: 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test',
  file: (req, file) => {
    return new Promise(async (resolve, reject) => {
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
  }
})
let edit = new GridFsStorage({
  url: 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test',
  file: (req, file) => {
    return new Promise(async (resolve, reject) => {
      let { n, branch, course } = req.body
      const filename = `${branch}_${course}_${n}`
      const fileInfo = {
        filename: filename,
        bucketName: 'questions'
      }
      try {
        let file = await File.findOne({ filename })
        if (file) {
          gfs.delete(file._id, err => {
            resolve(fileInfo)
          })
        }
        resolve(fileInfo)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
})

let upload = null

let editupload = null

storage.on('connection', db => {
  console.log('connected')
  upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    }
  }).single('image')
  editupload = multer({
    storage: edit,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    }
  }).single('image')
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
      ...req.body,
      n: n
    })
    question.save(err => {
      res.sendStatus(200)
    })
  })
})
router.get('/question/:branch/:course/:n/image', async (req, res) => {
  let filename = `${req.params.branch}_${req.params.course}_${req.params.n}`
  try {
    let { _id } = await File.findOne({ filename })
    gfs.openDownloadStream(_id).pipe(res)
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
  editupload(req, res, async err => {
    let question = await Question.findOneAndUpdate(
      { branch: req.body.branch, course: req.body.course, n: req.body.n },
      req.body,
      { new: true }
    )
    res.json({ success: true, question })
  })
})
module.exports = router
