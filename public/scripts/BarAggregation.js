function BarAggregation(selection) {
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
  var numBins = 10

  // Scale
  var xScale = d3.scaleLinear()
  var yScale = d3.scaleLinear()

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gChart

  // Initial creation of streaming scatter plot
  selection.each(function(selData) {

    // Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([selData])

    // Otherwise, create the skeletal chart
    gEnter = svg.enter().append('svg')
      .attr('id', 'aggregation')
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

  this.numBins = function (_) {
    if (!arguments.length) return numBins
    numBins = _
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
    for (var i = 0; i < numBins; i++) {
      var chunk = yMax / numBins
      var min = i * chunk
      var max = min + chunk
      var b = data.filter(function (d) {
        return min <= d[value] && d[value] < max
      })
      bins.push(b)
    }

    // Update the x-scale
    xScale
      .domain([0, d3.max(bins, function (d) {
        return d.length
      })])
      .range([0, chartWidth])

    // Bind
    var bars = gChart.selectAll('.bar')
      .data(bins, function (d, i) {
        return i + '-' + d.length
      })

    // Exit
    bars.exit().remove()

    // Enter + Update
    bars = bars.enter().append('rect')
      .attr('class', 'bar')
      .attr('width', function (d) {
        return xScale(d.length)
      })
      .attr('height', chartHeight / numBins)
      .attr('x', function (d) {
        return chartWidth - xScale(d.length)
      })
      .attr('y', function (d, i) {
        return chartHeight - (chartHeight / numBins * (i + 1))
      })
  }

  return this
}
