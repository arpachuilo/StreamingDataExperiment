function WholeScreenProxy (g, margin, xScale, yScale, xValue, yValue) {
  var targetClass = '.point'
  var proxyTargets = g.append('g')
    .attr('class', 'captured')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  d3.select('body').on('keydown', function () {
    if (d3.event.key === 'c') {
      proxyTargets.selectAll('*').remove()
      if (typeof Redis !== 'undefined') {
        Redis.wrappedAdd('proxy_cleared', {
          method: 'wholeScreen'
        })
      }
    }
    if (d3.event.key === 's') {
      proxyTargets.selectAll('*').remove()
      var t = d3.selectAll(targetClass)
      t.each(function (d) {
        var point = d3.select(this)
        proxyTargets.append('path')
          .datum(d)
          .attr('class', 'proxy')
          .attr('d', point.attr('d'))
          .attr('transform', point.attr('transform'))
          .on('click', point.on('click'))
      })
      if (typeof Redis !== 'undefined') {
        Redis.wrappedAdd('proxy_used', {
          numTargets: t.size(),
          method: 'wholeScreen'
        })
      }
    }
  })

  this.kill = function () {
    proxyTargets.remove()
  }

  return this
}
