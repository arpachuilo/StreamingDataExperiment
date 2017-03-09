var express = require('express')
var http = require('http')
var url = require('url')
var WebSocket = require('ws')
var autolinker = require('text-autolinker')
var Twitter = require('twitter')

var app = express()

app.use(express.static(__dirname + '/public'))
app.use('/libs', express.static(__dirname + '/node_modules/moment/min/'))
app.use('/libs', express.static(__dirname + '/node_modules/moment-duration-format/lib/'))
app.use('/libs', express.static(__dirname + '/node_modules/d3/build/'))
app.use('/libs', express.static(__dirname + '/node_modules/twitter/lib/'))
app.use('/libs', express.static(__dirname + '/node_modules/text-autolinker/bin/'))

console.log('creating server on 8080')
var server = http.createServer(app).listen(8080)

var wss = new WebSocket.Server( { server })

var ws = null
wss.on('connection', function (_ws) {
  ws = _ws
})

var client = new Twitter({
  consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
  consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
  access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
  access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
})

var stream = client.stream('statuses/filter', {
  track: 'trump'
})

stream.on('data', function (tweet) {
  if (ws !== null) {
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
        ws.send(JSON.stringify(data))
      })
    } catch (e) {}
  }
})
