// var io = requirejs('socket.io-client')

var Redis = (function () {
  var socket = io.connect('http://localhost:8080')

  function add (k, y) {
    socket.emit('add', k, v)
  }

  function set (){
    socket.emit('set', k, v)
  }

  return {
    add: add,
    set: set
  }
}())
