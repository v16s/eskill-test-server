const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const router = require('express').Router()
const path = require('path')
const { Question, File } = require('../models')
const GridFsStorage = require('multer-gridfs-storage')
let gfs
router.use(express.static('./public'))
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
      try {
        let n = await Question.countDocuments({
          branch: req.body.branch,
          course: req.body.course
        }).exec()
        let question = new Question({
          ...req.body,
          n: n,
          options: JSON.parse(req.body.options),
          answer: parseInt(req.body.answer)
        })
        await question.save()
        const filename = `${req.body.branch}_${req.body.course}_${n}`
        const fileInfo = {
          filename: filename,
          bucketName: 'questions'
        }
        resolve(fileInfo)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
})
let edit = new GridFsStorage({
  url: 'mongodb://admin:password1@ds031947.mlab.com:31947/eskill-test',
  file: (req, file) => {
    return new Promise(async (resolve, reject) => {
      let { n, branch, course } = req.body
      console.log(branch, course, n)
      n = parseInt(n)
      const filename = `${branch}_${course}_${n}`
      console.log(filename)
      const fileInfo = {
        filename: filename,
        bucketName: 'questions'
      }
      try {
        let file = await File.findOne({ filename })
        if (file) {
          gfs.delete(file._id, async err => {
            console.log(err)
            let question = await Question.findOne({
              branch,
              course,
              n
            })
            question = {
              ...question.toObject(),
              ...req.body,
              options: JSON.parse(req.body.options)
            }
            await Question.findOneAndUpdate(
              {
                branch,
                course,
                n
              },
              question
            )
            resolve(fileInfo)
          })
        } else {
          let question = await Question.findOne({
            branch,
            course,
            n
          })
          question = {
            ...question.toObject(),
            ...req.body,
            options: JSON.parse(req.body.options)
          }
          await Question.findOneAndUpdate(
            {
              branch,
              course,
              n
            },
            question
          )
          resolve(fileInfo)
        }
      } catch (err) {
        reject(err)
      }
    })
  }
})
let del = filename => {
  console.log(filename)
  return new Promise(async (resolve, reject) => {
    let file = await File.findOne({ filename })
    if (file) {
      gfs.delete(file._id, err => {
        console.log('deleting')
        resolve()
      })
    } else {
      reject()
    }
  })
}
let upload = null

let editupload = null

storage.on('connection', db => {
  ;('connected')
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
  if (req.headers['content-type'].includes('application/json')) {
    try {
      let n = await Question.countDocuments({
        branch: req.body.branch,
        course: req.body.course
      }).exec()
      let question = new Question({
        ...req.body,
        n: n,
        options: JSON.parse(req.body.options),
        answer: parseInt(req.body.answer)
      })
      await question.save()
      res.status(200).send({ success: true })
    } catch (err) {
      res.status(400).send({ success: false, err })
    }
  } else {
    upload(req, res, async err => {
      if (err) {
        res.status(400).send({ success: false, err })
      } else {
        res.status(200).send({ success: true })
      }
    })
  }
})
router.get('/question/:branch/:course/:n/image', async (req, res) => {
  let filename = `${req.params.branch}_${req.params.course}_${req.params.n}`
  try {
    let { _id } = await File.findOne({ filename })
    let stream = gfs.openDownloadStream(_id)
    let chunks = []
    stream.on('data', function (chunk) {
      chunks.push(chunk)
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
router.get('/question/:branch/:course/:n', async (req, res) => {
  try {
    let { branch, course, n } = req.params
    let question = await Question.findOne({ branch, course, n })
    res.json(question)
  } catch (err) {
    err
  }
})
router.get('/questions/:branch/:course', async (req, res) => {
  try {
    let questions = await Question.find(req.params)
    res.json({ success: true, questions })
  } catch (err) {}
})

router.post('/editQuestion', async (req, res) => {
  if (req.headers['content-type'].includes('application/json')) {
    try {
      let question = await Question.findOne({
        branch: req.body.branch,
        course: req.body.course,
        n: req.body.n
      })
      question = {
        ...question.toObject(),
        ...req.body,
        options: JSON.parse(req.body.options)
      }
      await Question.findOneAndUpdate(
        {
          branch: req.body.branch,
          course: req.body.course,
          n: req.body.n
        },
        question
      )
      if (req.body.del) {
        let filename = `${req.body.branch}_${req.body.course}_${req.body.n}`
        console.log(filename)
        await del(filename)
      }
      res.json({ success: true, question })
    } catch (err) {
      console.log(err)
      res.status(400).send({ success: false, err })
    }
  } else {
    editupload(req, res, async err => {
      console.log(err)
      res.json({ success: true })
    })
  }
})

router.post('/deleteQuestion', async (req, res) => {
  try {
    let file = await File.findOne({
      filename: `${req.body.branch}_${req.body.course}_${req.body.n}`
    })
    if (file) {
      gfs.delete(file._id, async err => {
        let question = await Question.deleteOne({
          branch: req.body.branch,
          course: req.body.course,
          n: req.body.n
        })
        res.sendStatus(200)
      })
    } else {
      let question = await Question.deleteOne({
        branch: req.body.branch,
        course: req.body.course,
        n: req.body.n
      })
      res.sendStatus(200)
    }
  } catch (err) {
    res.sendStatus(400)
  }
})

module.exports = router
