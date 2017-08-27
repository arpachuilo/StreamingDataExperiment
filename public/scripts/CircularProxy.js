function CircularProxy (g, margin, xScale, yScale, xValue, yValue) {
  var radius = 30
  var targetClass = '.point'
  var pt = [0, 0]

  g.selectAll('.proxy').remove()
  g.selectAll('.captured').remove()

  var proxyRegion = g.append('circle')
    .attr('class', 'proxy')
    .attr('fill-opacity', 0.2)
    .attr('fill', 'grey')
    .attr('r', radius)
    .attr('pointer-events', 'none')

  var proxyTargets = g.append('g')
    .attr('class', 'captured')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  g.on('mousemove', function () {
    pt = d3.mouse(this)
    proxyRegion
      .attr('cy', pt[1])
      .attr('cx', pt[0])
  })

  d3.select('body').on('keydown', function () {
    if (d3.event.key === 'c') {
      proxyTargets.selectAll('*').remove()
    }
    if (d3.event.shiftKey) {
      proxyTargets.selectAll('*').remove()
      var t = d3.selectAll(targetClass)
        .filter(function (d) {
          return distance(pt, [xScale(+d[xValue]) + margin.left, yScale(+d[yValue]) + margin.top]) < radius
        })
        .each(function (d) {
          var point = d3.select(this)
          proxyTargets.append('path')
            .datum(d)
            .attr('class', 'proxy-' + d.hashtag)
            .attr('d', point.attr('d'))
            .attr('transform', point.attr('transform'))
            .on('click', point.on('click'))
        })
    }
  })

  this.kill = function () {
    proxyTargets.remove()
    proxyRegion.remove()
  }

  return this
}

function distance(a, b) {
	var diff = [b[0] - a[0], b[1] - a[1]]
	return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1])
}
