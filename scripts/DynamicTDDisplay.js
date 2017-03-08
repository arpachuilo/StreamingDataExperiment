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
      el.appendChild(generateCard(d))
    })

    return this
  }

  return this
}

function generateCard (datum) {
  var card = document.createElement('figure')
  card.classList.add('card')

  if (datum.user) {
    var user = document.createElement('h4')
    user.classList.add('title')
    user.innerHtml = datum.user
    card.appendChild(user)
  }

  if (datum.img) {
    var img = document.createElement('img')
    img.classList.add('picture')
    img.setAttribute('src', datum.img)
    card.appendChild(img)
  }

  if (datum.text) {
    var txt = document.createElement('p')
    txt.classList.add('text')
    txt.textContent = datum.text
    card.appendChild(txt)
  }

  return card
}
