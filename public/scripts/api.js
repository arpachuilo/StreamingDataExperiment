var Redis = (function () {
  var socket = io.connect('http://localhost:8080')
  var stream = null
  var aggOrdering = null
  var cursorOrdering = null

  var currentAgg = null
  var currentCursor = null

  var cursorX = -1
  var cursorY = -1
  document.onmousemove = function (e) {
    cursorX = e.pageX
    cursorY = e.pageY
  }

  socket.on('ordering', function (agg, cursor) {
    aggOrdering = agg
    cursorOrdering = cursor

    var event = new Event('gotOrdering')
    document.body.dispatchEvent(event)
  })

  function add (k, v) {
    socket.emit('add', k, v)
  }

  function set (k, v) {
    socket.emit('set', k, v)
  }

  function clear () {
    socket.emit('delete')
  }

  function wrappedAdd (k, v) {
    socket.emit('add', k, {
      meta: v,
      time: +(new Date()),
      streamBounds: stream.getCurrentStreamingBounds(),
      x: cursorX,
      y: cursorY,
      aggregation: currentAgg,
      cursor: currentCursor
    })
  }

  function setStream (s) {
    stream = s
  }

  function getAggOrdering () {
    return aggOrdering
  }

  function getCursorOrdering () {
    return cursorOrdering
  }

  function setCurrentAgg(_) {
    currentAgg = _
  }

  function setCurrentCursor(_) {
    currentCursor = _
  }

  function getID () {
    return socket.id
  }

  return {
    add: add,
    set: set,
    wrappedAdd: wrappedAdd,
    setStream: setStream,
    getAggOrdering: getAggOrdering,
    getCursorOrdering: getCursorOrdering,
    setCurrentAgg: setCurrentAgg,
    setCurrentCursor: setCurrentCursor,
    getID: getID,
    clear: clear
  }
}())
