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

var twitterClient
if (CONFIG.LIVE_STREAM) {
  twitterClient = new Twitter({
    consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
    consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
    access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
    access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
  })
}

var id, data, save

if (CONFIG.LOGGING) {
  console.log('Setting up logger . . .')
  id = ''
  data = { id: id }
  save = function () {
    redisClient.set(id, JSON.stringify(data))
  }
}

var twitterStream
if (CONFIG.LIVE_STREAM) {
  twitterStream = twitterClient.stream('statuses/filter', CONFIG.STREAM_PARAMS)
  console.log('Starting live twitter stream . . .')
}

io.on('connection', function (socket) {

  if (CONFIG.LOGGING) {
    socket.on('id', function (value) {
      id = value
      data.id = id
    })

    socket.on('add', function (key, value) {
      console.log(key, value)
      if (key in data) {
        data[key].push(value)
      } else {
        data[key] = []
        data[key].push(value)
      }
      save()
    })

    socket.on('set', function (key, value) {
      data[key] = value
    })

    socket.on('save', function () {
      save()
    })
  }

  if (CONFIG.LIVE_STREAM) {
    twitterStream.on('data', function (tweet) {
      try {
        autolinker.parse(tweet, function(err, result) {
          var text = result.html
          var data = {
            id: tweet.id,
            rt_overtime: tweet.retweet_count,
            fav_overtime: tweet.favorite_count,
            time: tweet.timestamp_ms,
            user: tweet.user.screen_name,
            profile_pic: tweet.user.profile_image_url,
            followers: tweet.user.followers_count,
            following: tweet.user.friends_count,
            text: tweet.text,
            fixed_text: text
          }
          socket.emit('tweet', JSON.stringify(data))
        })
      } catch (e) {}
    })
  }
})
