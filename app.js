var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')

var book = require('./routes/book')
var auth = require('./routes/auth')
var cors = require('cors')
var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/book', book)

// catch 404 and forward to error handler

app.use('/api/auth', auth)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose
  .connect(
    require('./config.json').dburl,
    { promiseLibrary: require('bluebird'), useNewUrlParser: true }
  )
  .then(() => console.log('connection succesful'))
  .catch(err => console.error(err))

module.exports = app
