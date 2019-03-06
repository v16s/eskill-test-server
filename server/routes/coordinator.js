const express = require('express')
const multer = require('multer')
const router = require('express').Router()
const path = require('path')
const { Question } = require('../models')
router.use(express.static('./public'))

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
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
  let { branch, course, title, definition } = req.body
  upload(req, res, err => {
    let question = new Question({
      branch: req.body.branch,
      course: req.body.course,
      title: req.body.title,
      definition: req.body.title,
      Image: req.file.path
    })
    res.sendStatus(200)
    question.save()
  })
})

module.exports = router
