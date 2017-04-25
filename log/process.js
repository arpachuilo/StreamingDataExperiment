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
console.log(json.length)

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

console.log(question)