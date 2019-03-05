let router = require('express').Router()
let { Global, Branch } = require('../models')

router.get('/', (req, res) => {
  Global.findOne({ id: 0 }, (err, doc) => {
    console.log(doc)
    res.send(doc)
  })
})
router.get('/branches', async (req, res) => {
  try {
    let branches = await Branch.find()
    res.json({ success: true, branches })
  } catch (err) {
    res.json({ success: false, err })
  }
})
module.exports = router
