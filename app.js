var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())
app.use(cookieParser())

// For CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

// Main routing
app.use(require('./routes'))

/// catch 404 error
app.use(function(req, res, next) {
  res.status(404).end('Not Found')
})

app.listen(3000)
console.log('Server is online.')
