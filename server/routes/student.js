let router = require('express').Router()
let { Report, Branch, Test, User } = require('../models')

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
