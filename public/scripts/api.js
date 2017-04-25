var Redis = (function () {
  var socket = io.connect('http://localhost:8080')
  var stream = null
  var aggOrdering = null
  var cursorOrdering = null

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

  function wrappedAdd (k, v) {
    socket.emit('add', k, {
      meta: v,
      time: +(new Date()),
      streamBounds: stream.getCurrentStreamingBounds()
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
    getID: getID
  }
}())
