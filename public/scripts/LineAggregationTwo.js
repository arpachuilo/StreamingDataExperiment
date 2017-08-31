function LineAggregationTwo(selection) {
  var selection = selection
  selection.selectAll('*').remove()
  // Dimensions
  var margin = {
    top: 5,
    right: 0,
    bottom: 45,
    left: 85
  }

  var toTrack = ['FridayFeeling', 'FlashbackFriday', 'Harvey2017', 'USA']
  var numTracked = toTrack.length
  var numBins = 4

  // need to fit 4 into this height?
  // NOTE: Need to take into account top margin
  var height = (window.innerHeight * .55)
  var width = selection.node().offsetWidth
  var chartWidth = width - margin.right - margin.left
  var chartHeight = height - margin.top - margin.bottom

  var heightSlice = chartHeight / numBins

  // Tooltip stuff
  var tipFn = function (d, i) {
    var text = d.length + ' Tweets'
    return text
  }

  var tip = new Tooltip()
    .attr('className', 'tooltip')
    .offset([-8, 0])
    .useMouseCoordinates(true)
    .html(tipFn)

  // Acessor values
  var value = 'x'
  var idValue = 'id'
  var timeValue = 'time'

  // Scale
  var x = d3.scaleTime()
  var y = d3.scaleLinear()

  // Axis
  var xAxis = d3.axisBottom()
  var yAxis = d3.axisLeft()

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gChart, gXAxis, gYAxis

  // Initial creation of streaming scatter plot
  selection.each(function(selData) {

    // Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([selData])

    // Otherwise, create the skeletal chart
    gEnter = svg.enter().append('svg')
      .attr('id', 'aggregation')
      .attr('width', width)
      .attr('height', height)

    // Transform container
    gEnter = gEnter.append('g')
      .attr('class', 'container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Axis container
    gXAxis = gEnter.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + 0 + ',' + chartHeight + ')')

    for (var index = 1; index < numBins; index++) {
      var _y = chartHeight - (heightSlice * index)
      gEnter.append('path')
        .attr('stroke', 'black')
        .attr('d', 'M' + 0 + ' ' + _y + ' L' + chartWidth + ' ' + _y)
    }

    gYText = []
    for (var index = 0; index < numBins; index++) {
      var _y = chartHeight - (heightSlice * (index + 1))
      gYText.push(
        gEnter.append('text')
          .attr('class', 'text' + index)
          .attr('x', -margin.left)
          .attr('y', _y + (heightSlice / 2))
          .attr('font-size', 11)
          .text(function (d) { return index; })
      )
    }

    // Multiple Y Axes
    gYAxis = []
    for (var i = 0; i < numBins; i++) {
      gYAxis.push(
        gEnter.append('g')
          .attr('class', 'axis')
      )
    }

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

  // Updates the visual stream
  this.aggregate = function(t0, t1, data) {
    // Update the scales
    // X won't change
    x
      .domain([t0, t1])
      .range([0, chartWidth])

    var lineGen = d3.line()
      .x(function (d) { return x(d[timeValue]); })
      .y(function (d, i) { return y(i); })

    for (var index = 0; index < numBins; index++) {
      var yMax = d3.max(data, function (d) {
        return d[value]
      }) + 1

      yMax = Math.max(yMax, 100)
      binSize = yMax / numBins

      var binnedSet = data.filter(function (d) {
        return d[timeValue] < t1 &&
          d[value] < (binSize * (index + 1)) &&
          d[value] > (binSize * index)
      })

      gYText[index].html(function () {
        return (binSize * index) + ' - ' + (binSize * (index + 1))
      })

      // Y has stepping height
      y
        .domain([0, binnedSet.length])
        .range([chartHeight - (heightSlice * index), chartHeight - (heightSlice * (index + 1))])

      for (var jndex = 0; jndex < numTracked; jndex++) {
        var subset = binnedSet.filter(function (d) {
          return  d.hashtag === toTrack[jndex]
        })

        var gLine = gChart.selectAll('.line' + toTrack[jndex] + index)
          .data([subset])

        // Enter + Update
        gLine.enter().append('path')
          .attr('class', 'line' + toTrack[jndex] +  + index + ' ' + toTrack[jndex])
          .merge(gLine)
          .attr('d', lineGen)
          .on('mouseenter', function (d, i) {
            tip.show(d3.event, d, i)
            if (typeof Redis !== 'undefined') {
              Redis.wrappedAdd('aggregationHover', {
                method: 'lineChart',
                line: toTrack[jndex]
              })
            }
          })
      }

      // Rener axes
      gYAxis[index].call(yAxis.scale(y).ticks(2))
    }

    gXAxis.call(xAxis.scale(x).ticks(4))
  }

  return this
}
