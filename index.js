var express = require('express')
var http = require('http')
var url = require('url')
var autolinker = require('text-autolinker')
var Twitter = require('twitter')

var CONFIG = require('./public/config.json')

var app = express()

app.use(express.static(__dirname + '/public'))
app.use('/libs', express.static(__dirname + '/node_modules/moment/min/'))
app.use('/libs', express.static(__dirname + '/node_modules/moment-duration-format/lib/'))
app.use('/libs', express.static(__dirname + '/node_modules/d3/build/'))
app.use('/libs', express.static(__dirname + '/node_modules/twitter/lib/'))
app.use('/libs', express.static(__dirname + '/node_modules/text-autolinker/bin/'))
app.use('/libs', express.static(__dirname + '/node_modules/requirejs/bin/'))
app.use('/libs', express.static(__dirname + '/node_modules/socket.io-client/dist/'))

console.log('Starting server on 8080 . . .')
var server = http.createServer(app).listen(8080)
var io = require('socket.io')(server)

var redis, redisClient
if (CONFIG.LOGGING) {
  redis = require('redis')
  redisClient = redis.createClient()
}

var data, save

if (CONFIG.LOGGING) {
  console.log('Setting up logger . . .')
  data = {}
  save = function (id) {
    redisClient.set(id, JSON.stringify(data[id]))
  }
}

io.on('connection', function (socket) {

  if (CONFIG.LOGGING) {
    data[socket.id] = {}
    data[socket.id].id = socket.id

    socket.on('add', function (key, value) {
      console.log(socket.id, data)
      if (key in data) {
        data[socket.id][key].push(value)
      } else {
        data[socket.id][key] = []
        data[socket.id][key].push(value)
      }
      save(socket.id)
    })

    socket.on('set', function (key, value) {
      data[socket.id][key] = value
    })

    socket.on('save', function () {
      save()
    })
  }
})
