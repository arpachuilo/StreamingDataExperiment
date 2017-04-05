function HeatmapAggregation(selection) {
  var selection = selection
  selection.selectAll('*').remove()
  // Dimensions
  var margin = {
    top: 10,
    right: 0,
    bottom: 45,
    left: 70
  }
  var height = 420
  var width = selection.node().offsetWidth
  var chartWidth = width - margin.right - margin.left
  var chartHeight = height - margin.top - margin.bottom

  // Acessor values
  var value = 'x'
  var idValue = 'id'
  var timeValue = 'time'
  var numYBins = 10
  var numXBins = 5

  // Scale
  var colorScale = d3.scaleLinear()

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gChart

  // Initial creation of streaming scatter plot
  selection.each(function(selData) {

    // Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([selData])

    // Otherwise, create the skeletal chart
    gEnter = svg.enter().append('svg')
      .attr('id', 'chart')
      .attr('width', width)
      .attr('height', height)

    // Transofrm container
    gEnter = gEnter.append('g')
      .attr('class', 'container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Update the inner dimensions
    gChart = gEnter.append('g')
      .attr('class', 'chart')
  })

  this.destroy = function () {
    selection.selectAll('*').remove()
  }

  this.margin = function (_) {
    if (!arguments.length) return margin
    margin = _
    return this
  }

  this.width = function (_) {
    if (!arguments.length) return width
    width = _
    return this
  }

  this.height = function (_) {
    if (!arguments.length) return height
    height = _
    return this
  }

  this.v = function (_) {
    if (!arguments.length) return value
    value = _
    return this
  }

  this.id = function (_) {
    if (!arguments.length) return idValue
    idValue = _
    return this
  }

  this.time = function (_) {
    if (!arguments.length) return timeValue
    timeValue = _
    return this
  }

  this.numYBins = function (_) {
    if (!arguments.length) return numYBins
    numYBins = _
    return this
  }

  this.numXBins = function (_) {
    if (!arguments.length) return numXBins
    numXBins = _
    return this
  }

  // Updates the visual stream
  this.aggregate = function(t0, t1, data) {
    var yMax = d3.max(data, function (d) {
      return d[value]
    }) + 1

    // Filter out data by time
    data = data.filter(function (d) {
      return d[timeValue] < t1
    }) //get data from stream

    // Bin
    var bins = []
    for (var i = 0; i < numYBins; i++) {
      var ychunk = yMax / numYBins
      var ymin = i * ychunk
      var ymax = ymin + ychunk
      var firstPass = data.filter(function (d) {
        return ymin <= d[value] && d[value] < ymax
      })
      for (var j = 0; j < numXBins; j++) {
        var xchunk = (t1 - t0) / numXBins
        var xmin = j * xchunk + t0
        var xmax = xmin + xchunk
        var cell = firstPass.filter(function (d) {
          return xmin <= d[timeValue] && d[timeValue] < xmax
        })
        cell.i = i
        cell.j = j
        bins.push(cell)
      }
    }

    // Update the colorScale
    colorScale
      .interpolate(d3.interpolateHcl)
      .domain([0, d3.max(bins, function (d) {
        return d.length
      })])
      .range(['#F6F6F6', '#1c5b5a'])

    // Bind
    var bars = gChart.selectAll('.cell')
      .data(bins, function (d, i) {
        return d.i + '-' + d.j + '-' + d.length
      })

    // Exit
    bars.exit().remove()

    // Enter + Update
    bars = bars.enter().append('rect')
      .attr('class', 'cell')
      .attr('width', chartWidth / numXBins)
      .attr('height', chartHeight / numYBins)
      .attr('fill', function (d) {
        return colorScale(d.length)
      })
      .attr('x', function (d) {
        return chartWidth / numXBins * d.j
      })
      .attr('y', function (d) {
        return chartHeight - (chartHeight / numYBins * (d.i + 1))
      })
  }

  return this
}
