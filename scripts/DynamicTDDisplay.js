function DynamicCardGrid (el) {
  var data = []
  var el = el

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
      generateCard(d, el)
    })

    return this
  }

  return this
}

function generateCard (datum, el) {
  var card = document.createElement('figure')
  card.classList.add('card')

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
    var user = document.createElement('p')
    user.classList.add('title')
    user.innerText = datum.user
    textContainer.appendChild(user)
  }

  if (datum.fixed_text) {
    var txt = document.createElement('p')
    txt.classList.add('text')
    textContainer.appendChild(txt)
    txt.innerHTML = datum.fixed_text
  }
}
