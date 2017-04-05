https://bl.ocks.org/mbostock/f705fc55e6f26df29354
function LassoProxy (g, margin, xScale, yScale, xValue, yValue, stream) {
  var targetClass = '.point'

  g.selectAll('.proxy').remove()
  g.selectAll('.captured').remove()

  var line = d3.line().curve(d3.curveBasis)
  var proxyRegion = g.append('path')
    .attr('class', 'proxy')
    .attr('fill-opacity', 0.2)
    .attr('fill', 'grey')
    .attr('pointer-events', 'none')

  var proxyTargets = g.append('g')
    .attr('class', 'captured')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  g.call(d3.drag()
    .container(function() { return this })
    .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
    .on('start', dragstarted))

  var draggin = false
  function dragstarted() {
    var d = d3.event.subject
    var active = proxyRegion.datum(d)
    var x0 = d3.event.x
    var y0 = d3.event.y

    d3.event.on('start', function () {
      dragging = false
      document.body.dispatchEvent(new Event('pause'))
    })

    d3.event.on('drag', function() {
      dragging = true
      var x1 = d3.event.x
      var y1 = d3.event.y
      var dx = x1 - x0
      var dy = y1 - y0

      if (dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1])
      else d[d.length - 1] = [x1, y1]
      active.attr('d', line)
    })

    d3.event.on('end', function () {
      if (dragging) {
        dragging = false
        proxyTargets.selectAll('*').remove()
        d3.selectAll(targetClass)
          .filter(function (f) {
            var pt = [xScale(+f[xValue]) + margin.left, yScale(+f[yValue]) + margin.top]
            return d3.polygonContains(d, pt)
          })
          .each(function (d) {
            var point = d3.select(this)
            proxyTargets.append('path')
              .datum(d)
              .attr('class', 'proxy')
              .attr('d', point.attr('d'))
              .attr('transform', point.attr('transform'))
              .on('click', point.on('click'))
          })
        active.attr('d', null)
      }
      document.body.dispatchEvent(new Event('resume'))
    })
  }

  d3.select('body').on('keydown', function () {
    if (d3.event.key === 'c') {
      proxyTargets.selectAll('*').remove()
    }
  })

  this.kill = function () {
    g.on('.drag', null)
    proxyTargets.remove()
    proxyRegion.remove()
  }

  return this
}

function distance(a, b) {
	var diff = [b[0] - a[0], b[1] - a[1]]
	return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1])
}
