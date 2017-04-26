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

// https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
function getViewport () {
  var viewportwidth;
  var viewportheight;

  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

  if (typeof window.innerWidth != 'undefined')
  {
       viewportwidth = window.innerWidth,
       viewportheight = window.innerHeight
  }

  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

  else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0)
  {
        viewportwidth = document.documentElement.clientWidth,
        viewportheight = document.documentElement.clientHeight
  }

  // older versions of IE

  else
  {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
  }

  return [viewportwidth, viewportheight]
}
