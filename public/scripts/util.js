function functor (f) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key]
  }

  return typeof f === 'function' ? f.apply(undefined, args) : f
}

// Cross browser helpers
function getWidth () {
  if (self.innerWidth) {
    return self.innerWidth
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth
  }

  if (document.body) {
    return document.body.clientWidth
  }
}

function getHeight () {
  if (self.innerHeight) {
    return self.innerHeight
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight
  }

  if (document.body) {
    return document.body.clientHeight
  }
}

function scrollTop () {
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop
  }

  if (document.body) {
    return document.body.scrollTop
  }
}

function scrollLeft () {
  if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft
  }

  if (document.body) {
    return document.body.scrollLeft
  }
}
