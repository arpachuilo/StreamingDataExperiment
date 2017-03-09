function BoundingBoxProxy (g, margin, xScale, yScale, xValue, yValue) {
  var targetClass = '.point'
  var pt1 = [0, 0]
  var pt2 = [0, 0]
  var width = 0
  var height = 0
  var x = 0
  var y = 0


  var proxyRegion = g.append('rect')
    .attr('class', 'proxy')
    .attr('fill-opacity', 0.2)
    .attr('fill', 'grey')
    .attr('pointer-events', 'none')

  var proxyTargets = g.append('g')
    .attr('class', 'captured')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var mDown = false
  var mMove = false
  g
    .on('click', function () {
      mDown = false
      mMove = false
    })
    .on('mousedown', function () {
      mDown = true
      pt1 = d3.mouse(this)
    })
    .on('mousemove', function () {
      if (mDown) {
        mMove = true
        pt2 = d3.mouse(this)
        width = pt2[0] - pt1[0]
        height = pt2[1] - pt1[1]
        x = pt1[0]
        y = pt1[1]
        if (width < 0) {
          x = pt2[0]
          width = pt1[0] -  pt2[0]
        }
        if (height < 0) {
          y = pt2[1]
          height = pt1[1] -  pt2[1]
        }
        proxyRegion
          .attr('x', x)
          .attr('y', y)
          .attr('width', width)
          .attr('height', height)
      }
    })
    .on('mouseup', function () {
      if (mDown && mMove) {
        mDown = false
        mMove = false
        proxyTargets.selectAll('*').remove()
        pt2 = [
          x + width,
          y + height
        ]
        var t = d3.selectAll(targetClass)
          .filter(function (d) {
            var pt = [xScale(+d[xValue]) + margin.left, yScale(+d[yValue]) + margin.top]
            return pt1[0] <= pt[0] && pt[0] <= pt2[0] &&
              pt1[1] <= pt[1] && pt[1] <= pt2[1]
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

        // Reset
        width = 0
        height = 0
        x = 0
        y = 0
        proxyRegion
          .attr('x', x)
          .attr('y', y)
          .attr('width', width)
          .attr('height', height)
      }
    })


  d3.select('body').on('keydown', function () {
    if (d3.event.key === 'c') {
      proxyTargets.selectAll('*').remove()
    }
  })

  this.destroy = function () {
    proxyTargets.remove()
    proxyRegion.remove()
  }

  return this
}

function distance(a, b) {
	var diff = [b[0] - a[0], b[1] - a[1]]
	return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1])
}
