var json = require('./data.json')

// Remove any that didn't complete study
for (var i = 0; i < json.length;) {
  if ('responses' in json[i]) {
    if (json[i].responses.length !== 18) {
      json.splice(i, 1)
    } else {
      i++
    }
  } else {
    json.splice(i, 1)
  }
}
console.log(json.length + ' participants')

// Get avg num capture targets
var lassoCaptureCount = 0
var lassoUsed = 0

var wholeScreenCaptureCount = 0
var wholeScreenUsed = 0
for (var i = 0; i < json.length; i++) {
  if ('proxy_used' in json[i]) {
    for (var j = 0; j < json[i].proxy_used.length; j++) {
      if (json[i].proxy_used[j].meta.method === 'lasso') {
        lassoCaptureCount += json[i].proxy_used[j].meta.numTargets
        lassoUsed += 1
      } else if (json[i].proxy_used[j].meta.method === 'wholeScreen') {
        wholeScreenCaptureCount += json[i].proxy_used[j].meta.numTargets
        wholeScreenUsed += 1
      }
    }
  }
}

console.log('lasso avg capture: ', lassoCaptureCount / lassoUsed)
console.log('wholescreen avg capture: ', wholeScreenCaptureCount / wholeScreenUsed)

// Get question responses
question = {}
for (var i = 0; i < json.length; i++){
  for(var j = 0; j < json[i].responses.length; ++j){
    key = json[i].responses[j].question + j
    if(key in question){
      question[key].push(json[i].responses[j].response)
    }
    else{
      question[key] = []
      question[key].push(json[i].responses[j].response)
    }
  }
}

// Get time spent per question
var timeTotalsByIndex = [] // index corresponds to question number
for (var i = 0; i < 18; i++) {
  timeTotalsByIndex.push(0)
}
for (var i = 0; i < json.length; i++) {
  var prevTime = json[i].timings[0].time
  for (var j = 1; j < json[i].timings.length; j++) {
    if (json[i].timings[j].meta.type === 'end') {
      var currTime = json[i].timings[j].time
      timeTotalsByIndex[json[i].timings[j].meta.questionIndex] += (currTime - prevTime)
      prevTime = currTime
    }
  }
}

timeTotalsByIndex.forEach(function (d, i) {
  console.log('Question ' + i + ' time: ' + ((d / 1000) / 4) + ' seconds')
})

// Get avg time spent with certain technique combinations
var timeTotalsByKey = {
  HeatmapAggregationWholeScreenProxy: 0,
  HeatmapAggregationLassoProxy: 0,
  HeatmapAggregationNone: 0,
  BarAggregationWholeScreenProxy: 0,
  BarAggregationLassoProxy: 0,
  BarAggregationNone: 0,
  NoneWholeScreenProxy: 0,
  NoneLassoProxy: 0,
  NoneNone: 0
}

for (var i = 0; i < json.length; i++) {
  var prevTime = json[i].timings[0].time
  for (var j = 1; j < json[i].timings.length; j++) {
    if (json[i].timings[j].meta.type === 'end') {
      var currTime = json[i].timings[j].time
      var key = json[i].timings[j].aggregation + json[i].timings[j].cursor
      timeTotalsByKey[key] += (currTime - prevTime)
      prevTime = currTime
    }
  }
}

Object.keys(timeTotalsByKey).forEach(function (key) {
  console.log(key + ': ' + (timeTotalsByKey[key] / 1000 / 4) + ' seconds')
})

// More refined viewing of technique combination and question index
var timeTotalsComplete = []
for (var i = 0; i < 18; i++) {
  timeTotalsComplete.push({
    HeatmapAggregationWholeScreenProxy: 0,
    HeatmapAggregationWholeScreenProxyUsers: 0,
    HeatmapAggregationLassoProxy: 0,
    HeatmapAggregationLassoProxyUsers: 0,
    HeatmapAggregationNone: 0,
    HeatmapAggregationNoneUsers: 0,
    BarAggregationWholeScreenProxy: 0,
    BarAggregationWholeScreenProxyUsers: 0,
    BarAggregationLassoProxy: 0,
    BarAggregationLassoProxyUsers: 0,
    BarAggregationNone: 0,
    BarAggregationNoneUsers: 0,
    NoneWholeScreenProxy: 0,
    NoneWholeScreenProxyUsers: 0,
    NoneLassoProxy: 0,
    NoneLassoProxyUsers: 0,
    NoneNone: 0,
    NoneNoneUsers: 0
  })
}

for (var i = 0; i < json.length; i++) {
  var prevTime = json[i].timings[0].time
  for (var j = 1; j < json[i].timings.length; j++) {
    if (json[i].timings[j].meta.type === 'end') {
      var currTime = json[i].timings[j].time
      var key = json[i].timings[j].aggregation + json[i].timings[j].cursor
      timeTotalsComplete[json[i].timings[j].meta.questionIndex][key] += (currTime - prevTime)
      timeTotalsComplete[json[i].timings[j].meta.questionIndex][key + 'Users'] += 1
      prevTime = currTime
    }
  }
}

timeTotalsComplete.forEach(function (d, i) {
  console.log('Question ' + i + ' results')
  Object.keys(timeTotalsComplete[i]).forEach(function (key) {
    if (!key.includes('Users')) {
      console.log(key + ' with ' + timeTotalsComplete[i][key + 'Users'] + ' users: ' + (timeTotalsComplete[i][key] / 1000 / timeTotalsComplete[i][key + 'Users']) + ' seconds')
    }
  })
})

// Get num clear targets
var lassoClearUsed = 0
var wholeScreenClearUsed = 0
for (var i = 0; i < json.length; i++) {
  if ('proxy_cleared' in json[i]) {
    for (var j = 0; j < json[i].proxy_cleared.length; j++) {
      if (json[i].proxy_cleared[j].meta.method === 'lasso') {
        lassoClearUsed += 1
      } else if (json[i].proxy_cleared[j].meta.method === 'wholeScreen') {
        wholeScreenClearUsed += 1
      }
    }
  }
}

console.log('num lasso clear used: ', lassoClearUsed)
console.log('num wholescreen clear used: ', wholeScreenClearUsed)
