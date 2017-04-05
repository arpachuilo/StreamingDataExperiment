function WholeScreenProxy (g, margin, xScale, yScale, xValue, yValue) {
  var targetClass = '.point'

  var proxyTargets = g.append('g')
    .attr('class', 'captured')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  d3.select('body').on('keydown', function () {
    if (d3.event.key === 'c') {
      proxyTargets.selectAll('*').remove()
    }
    if (d3.event.shiftKey) {
      proxyTargets.selectAll('*').remove()
      var t = d3.selectAll(targetClass)
        .each(function (d) {
          var point = d3.select(this)
          proxyTargets.append('path')
            .datum(d)
            .attr('class', 'proxy')
            .attr('d', point.attr('d'))
            .attr('transform', point.attr('transform'))
            .on('click', point.on('click'))
        })
    }
  })

  this.kill = function () {
    proxyTargets.remove()
  }

  return this
}
