var Redis = (function () {
  var socket = io.connect('http://localhost:8080')
  var stream = null

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

  return {
    add: add,
    set: set,
    wrappedAdd: wrappedAdd,
    setStream: setStream
  }
}())
