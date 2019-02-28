let express = require('express')
let bodyParser = require('body-parser')
let { admin, student, validate, auth } = require('./routes')
let cors = require('cors')
let app = express()
let morgan = require('morgan')
let http = require('http')
let port = process.env.PORT || 3000
let passport = require('./config/passport')

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: 'false' }))

app.use('/api/auth', auth)
app.use('/api/admin', passport.authenticate('admin', { session: false }), admin)
app.use(
  '/api/student',
  passport.authenticate('student', { session: false }),
  student
)
app.use('/api/validate', validate)

let mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose
  .connect(
    require('./config.json').dburl,
    { promiseLibrary: require('bluebird'), useNewUrlParser: true }
  )
  .then(() => console.log('connection succesful'))
  .catch(err => console.error(err))

let server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}
