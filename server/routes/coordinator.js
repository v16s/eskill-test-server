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

const mongoURI = 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test';
const conn = mongoose.createConnection(mongoURI)
let gfs

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('questions')
})

const storage = multer.diskStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'questions'
        }
        resolve(fileInfo)
      })
    })
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('Image')

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

router.post('/addQuestion', function (req, res) {
  let { branch, course, title, definition, n, answer } = req.body
  upload(req, res, err => {
    let question = new Question({
      branch: req.body.branch,
      course: req.body.course,
      title: req.body.title,
      definition: req.body.title,
      n: req.body.n,
      answer: req.body.answer,
      Image: req.file.path
    })
    res.sendStatus(200)
    question.save()
  })
})

module.exports = router
