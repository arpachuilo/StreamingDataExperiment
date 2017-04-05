function StreamingChart(selection) {
  var selection = selection
  var data = []
  var aggregation = null

  // Dimensions
  var margin = {
    top: 10,
    right: 0,
    bottom: 45,
    left: 0
  }
  var height = 420
  var width = 860
  var chartWidth = width - margin.right - margin.left
  var chartHeight = height - margin.top - margin.bottom

  // Acessor values
  var xValue = 'x'
  var yValue = 'y'
  var idValue = 'id'

  // Scale
  var xScale = d3.scaleTime()
  var yScale = d3.scaleLinear()

  // Axes
  var xAxis = d3.axisBottom()
  var yAxis = d3.axisRight()
  var xLabel = 'time'
  var yLabel = 'value'

  // Time Window Settings
  var tStart = 0
  var tDelta = 0
  var timeWindow = 0.5 * 60 * 1000
  var timer = null

  // Glpyh settings
  var glyph = d3.symbol()
  var glyphSize = 256

  // Cursor settings
  var cursor = false
  var clickHandler = function () {}

  // Misc settings
  var zoomAllowed = true
  var pauseAllowed = true
  var paused = false

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gChart, gX, gY

  // Initial creation of streaming scatter plot
  selection.each(function(selData) {

    // Update the x-scale
    xScale
      .domain([tStart - timeWindow, tStart])
      .range([0, chartWidth])

    // Update the y-scale
    var yMax = d3.max(data, function(d) {
      return d[yValue]
    })
    yScale
      .domain([0, yMax])
      .range([chartHeight, 0])

    // Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([selData])

    // Otherwise, create the skeletal chart
    gEnter = svg.enter().append('svg')
      .on('wheel.zoom', zoom)
      .attr('id', 'stream')
      .attr('width', width)
      .attr('height', height)

    // Create Border
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('stroke', 'black')
      .style('fill', 'none')
      .style('stroke-width', '1px')

    // Create Clip
    defs = gEnter.append('defs')
    defs.append('clipPath')
        .attr('id', 'StreamChartClip')
      .append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)

    // Transofrm container
    gEnter = gEnter.append('g')
      .attr('class', 'container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Create rest of skeleton
    gX = gEnter.append('g').attr('class', 'x axis').attr('transform', 'translate(' + 0 + ',' + chartHeight + ')')
    gY = gEnter.append('g').attr('class', 'y axis')

    //Update the inner dimensions
    gChart = gEnter.append('g')
      .attr('class', 'chart')

    //Bind pause-start option
    d3.select('body')
      .on('keydown', function() {
        if (d3.event.keyCode == 32) {
          d3.event.preventDefault()
          toggle()
        }
        if (d3.event.keyCode === 80) {
          pause()
        }
        if (d3.event.keyCode === 82) {
          resume()
        }
      })
    document.body.addEventListener('pause', function () {
      pause()
    })
    document.body.addEventListener('resume', function () {
      resume()
    })

  })

  this.destroy = function () {
    timer.stop()
    d3.select('body').on('keydown.StreamScatterPlot', null)
    selection.selectAll('*').remove()
  };

  this.timeRange = function () {
    var now = tStart + tDelta
    return [now - timeWindow, now]
  }

  this.clickHandler = function (_) {
    if (!arguments.length) return clickHandler
    clickHandler = _
    return this
  }

  this.cursor = function (_) {
    if (!arguments.length) return cursor
    if (cursor) {
      cursor.kill()
    }
    cursor = _
    cursor = cursor(d3.select('#stream'), margin, xScale, yScale, xValue, yValue, stream)
    return this
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

  this.xLabel = function (_) {
    if (!arguments.length) return xLabel
    height = _
    return this
  }

  this.yLabel = function (_) {
    if (!arguments.length) return yLabel
    height = _
    return this
  }

  this.x = function (_) {
    if (!arguments.length) return xValue
    xValue = _
    return this
  }

  this.y = function (_) {
    if (!arguments.length) return yValue
    yValue = _
    if (aggregation !== null) {
      aggregation.v(yValue)
    }
    return this
  }

  this.id = function (_) {
    if (!arguments.length) return idValue
    idValue = _
    return this
  }

  this.glyph = function (_) {
    if (!arguments.length) return glyph
    glyph = _
    return this
  }

  this.glyphSize = function (_) {
    if (!arguments.length) return glyphSize
    glyphSize = _
    return this
  }

  this.timeWindow = function (_) {
    if (!arguments.length) return timeWindow
    timeWindow = _
    return this
  }

  this.allowZoom = function (_) {
    if (!arguments.length) return zoomAllowed
    zoomAllowed = _
    return this
  }

  this.allowPause = function (_) {
    if (!arguments.length) return pauseAllowed
    pauseAllowed = _
    return this
  }

  this.isPaused = function () {
    return paused
  }

  this.start = function () {
    timer = d3.timer(function(e) {
      tDelta = e
      if (!paused) {
        if (aggregation !== null) {
          aggregation.aggregate(tStart, xScale.domain()[0], this.data)
        }
        step()
      }
    }, 1000)
    return this
  }

  this.setNow = function (_) {
    if (!arguments.length) return tStart
    tStart = _
    return this
  }

  this.setAggregation = function(_) {
    if (!arguments.length) return aggregation
    aggregation = _
    aggregation.v(yValue)
    return this
  }

  this.toggle = function () {
    if (!pauseAllowed) {
      paused = false
    } else if (paused) {
      paused = !paused
    } else {
      paused = true
    }
    return this
  }

  this.pause = function () {
    paused = true
    return this
  }

  this.resume = function () {
    paused = false
    return this
  }

  this.setData = function (_) {
    if (!arguments.length) return data
    data = _
    return this
  }

  // Updates the visual stream
  this.step = function() {
    // Update the x-scale
    var now = tStart + tDelta
    xScale
      .domain([now - timeWindow, now])
      .range([0, chartWidth])
    // Update the y-scale
    var yMax = d3.max(this.data, function(d) {
      return d[yValue]
    })
    yScale
      .domain([0, yMax + 1])
      .range([chartHeight, 0])

    // Update Axes
    gX.call(xAxis.scale(xScale))
    gY.call(yAxis.scale(yScale).ticks(10))

    //Bind
    var points = gChart.selectAll('.point')
      .data(this.data, function(d) {
        return d[idValue]
      })

    // Exit
    points.exit().remove()

    // Enter + Update
    points = points.enter().append('path')
        .attr('class', 'point')
        .attr('d', glyph.size(glyphSize))
        .on('click', function (d, i) {
          clickHandler(d, i)
        })
      .merge(points)
        .attr('transform', function (d) {
          return 'translate(' + xScale(+d[xValue]) + ',' + yScale(+d[yValue]) + ')'
        })
  }

  //Alters the time scale so you can 'zoom' in and out of time
  function zoom () {
    if (zoomAllowed) {
      d3.event.preventDefault()
      var dy = +d3.event.wheelDeltaY
      var sign = dy < 0 ? -1 : +1
      dy = Math.pow(Math.abs(dy), 1.4) * sign

      if (timeWindow + dy > 10 * 1000) {
        timeWindow += dy
      } else {
        timeWindow = 10 * 1000
      }
    }
    step()
  }

  return this
}
