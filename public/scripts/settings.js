// File simply creates singleton changeable settings
var Settings = (function () {
  var dataset = ''
  var aggMethod = ''
  var proxMethod = ''

  function setDataset (_) {
    dataset = _
  }

  function setAggMethod (_) {
    aggMethod = _
  }

  function setProxMethod (_) {
    proxMethod = _
  }

  return {
    setDataset: setDataset,
    setAggMethod: setAggMethod,
    setProxMethod: setProxMethod
  }
}())
