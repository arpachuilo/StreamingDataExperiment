function TimeControl(selection) {
  var selection = selection
  var currentStream = null

  selection.selectAll('*').remove()
  // Dimensions
  var margin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 10
  }

  var width = selection.node().offsetWidth
  var height = 20

  var chartWidth = width - margin.left - margin.right

  var slideScale = d3.scaleLinear()
    .domain([0, width])
    .range([margin.left, chartWidth])
    .clamp(true)

  var tScale = d3.scaleLinear()
    .domain([margin.left, chartWidth])
    .clamp(true)

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gTrack, gHandle, playPause, resume

  // Initial creation of streaming scatter plot
  selection.each(function (selData) {

    // Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([selData])

    // Otherwise, create the skeletal chart
    gEnter = svg.enter().append('svg')
      .attr('id', 'timeControl')
      .attr('width', width)
      .attr('height', height)

    gTrack = gEnter.append('line')
      .attr('class', 'track')
      .attr('y1', height / 2)
      .attr('y2', height / 2)
      .attr('x1', margin.left)
      .attr('x2', chartWidth)
      .attr('stroke', 'gray')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', height / 2)
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)) })
        .attr('class', 'track-inset')
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)) })
        .attr('class', 'track-overlay')
      .call(d3.drag()
        .on('start.interrupt', function() { gHandle.interrupt() })
        .on('start drag', function() {
          slideUpdate(d3.event.x)
        })
      )

    gHandle = gEnter.append('circle')
      .attr('class', 'handle')
      .attr('r', height / 2)
      .attr('cy', height / 2)
      .attr('cx', chartWidth)
      .attr('fill', '#1c5b5a')

    playPause = gEnter.append('svg:image')
      .attr('class', 'icon')
      .attr('transform', 'translate(-10, -10)')
      .attr('height', height)
      .attr('width', height)
      .attr('y', height / 2)
      .attr('x', chartWidth + margin.right / 2)
      .attr('xlink:href', '../img/pause.png')
      .on('click', function () {
        if (currentStream !== null) {
          currentStream.toggle()

          var icon = d3.select(this)
          if (currentStream.isPaused()) {
            icon.attr('xlink:href', '../img/play.png')
          } else {
            icon.attr('xlink:href', '../img/pause.png')
          }
        }
      })

    resume = gEnter.append('svg:image')
      .attr('class', 'icon')
      .attr('transform', 'translate(-10, -10)')
      .attr('height', height)
      .attr('width', height)
      .attr('y', height / 2)
      .attr('x', chartWidth + margin.right)
      .attr('xlink:href', '../img/resume.png')
      .on('click', function () {
        if (currentStream !== null) {
          currentStream.setStart(+currentStream.getStreamingBounds()[1])
          gHandle.attr('cx', chartWidth)
        }
      })
  })

  this.slideUpdate = function (x) {
    x = slideScale(x)
    gHandle.attr('cx', x)

    if (currentStream !== null) {
      tScale
        .range(currentStream.getStreamingBounds())
      currentStream.setStart(+tScale(x))
    }
  }

  this.updateControls = function (now, xScale, stream) {
    currentStream = stream
  }

  return this
}
