function DynamicCardGrid (el, fn) {
  var data = []
  var el = el
  var fn = fn

  this.setData = function (_) {
    if (!arguments.length) return data
    data = _
    return this
  }

  this.update = function () {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild)
    }

    data.forEach(function (d) {
      generateCard(d, el, fn)
    })

    return this
  }

  return this
}

function generateCard (datum, el, fn) {
  var card = document.createElement('div')
  card.classList.add('card')
  card.addEventListener('mouseenter', function () {
    Redis.wrappedAdd('card_hover', {
      target: datum.id
    })
  })

  var picContainer = document.createElement('div')
  picContainer.classList.add('picContainer')

  card.appendChild(picContainer)

  var textContainer = document.createElement('div')
  textContainer.classList.add('textContainer')

  card.appendChild(textContainer)

  el.appendChild(card)

  if (datum.profile_pic) {
    var img = document.createElement('img')
    img.classList.add('picture')
    img.setAttribute('src', datum.profile_pic)
    picContainer.appendChild(img)
  }

  if (datum.user) {
    var userDiv = document.createElement('div')
    userDiv.classList.add('userDiv')

    var user = document.createElement('a')
    user.setAttribute('href', 'https://twiter.com/' + datum.user);
    user.classList.add('title')
    user.innerText = datum.user

    var userat = document.createElement('p')
    userat.innerHTML = "@" + datum.user
    userat.classList.add('titleat')

    userDiv.appendChild(user)
    userDiv.appendChild(userat)
    textContainer.appendChild(userDiv)

    var removeDiv = document.createElement('div')
    removeDiv.classList.add('removeDiv')

    var img = document.createElement('img')
    img.setAttribute('src', '../img/close.png')
    img.addEventListener('click', function (e) {
      fn(card, datum.id)
    })

    removeDiv.appendChild(img)
    textContainer.appendChild(removeDiv)
  }

  if (datum.text) {
    var txt = document.createElement('p')
    txt.classList.add('text')
    textContainer.appendChild(txt)
    txt.innerHTML = datum.text
  }
}
