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
  var height = 50
  var trackHeight = 20
  var timeHeight = 30

  var chartWidth = width - margin.left - margin.right

  var slideScale = d3.scaleLinear()
    .domain([0, width])
    .range([margin.left, chartWidth])
    .clamp(true)

  var tScale = d3.scaleLinear()
    .domain([margin.left, chartWidth])
    .clamp(true)

  // Selectors, dataset, and points to grab
  var svg, defs, gEnter, gTrack, gHandle, playPause, resume, endTime, startTime, curTime

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
      .attr('y1', trackHeight / 2)
      .attr('y2', trackHeight / 2)
      .attr('x1', margin.left)
      .attr('x2', chartWidth)
      .attr('stroke', 'gray')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', trackHeight / 2)
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
      .attr('r', trackHeight / 2)
      .attr('cy', trackHeight / 2)
      .attr('cx', chartWidth)
      .attr('fill', '#1c5b5a')

    playPause = gEnter.append('svg:image')
      .attr('class', 'icon')
      .attr('transform', 'translate(-10, -10)')
      .attr('height', trackHeight)
      .attr('width', trackHeight)
      .attr('y', trackHeight / 2)
      .attr('x', chartWidth + margin.right / 2)
      .attr('xlink:href', '../img/pause.png')
      .on('click', function () {
        if (currentStream !== null) {
          currentStream.toggle()
          var icon = d3.select(this)
          if (currentStream.isPaused()) {
            currentStream.setManualPaused(true)
            Redis.wrappedAdd('paused', {
              unpauseAt: +tScale(gHandle.attr('cx'))
            })
            icon.attr('xlink:href', '../img/play.png')
          } else {
            currentStream.setManualPaused(false)
            Redis.wrappedAdd('unpaused', {
              pauseAt: +tScale(gHandle.attr('cx'))
            })
            icon.attr('xlink:href', '../img/pause.png')
          }
        }
      })

    resume = gEnter.append('svg:image')
      .attr('class', 'icon')
      .attr('transform', 'translate(-10, -10)')
      .attr('height', trackHeight)
      .attr('width', trackHeight)
      .attr('y', trackHeight / 2)
      .attr('x', chartWidth + margin.right)
      .attr('xlink:href', '../img/resume.png')
      .on('click', function () {
        if (currentStream !== null) {
          Redis.wrappedAdd('resumed', {
            prevTime: +tScale(gHandle.attr('cx')),
            resumedTime: +currentStream.getStreamingBounds()[1]
          })

          currentStream.setStart(+currentStream.getStreamingBounds()[1])
          gHandle.attr('cx', chartWidth)
        }
      })

    endTime = gEnter.append('text')
      .attr('class', 'endtime')
      .attr('x', margin.left)
      .attr('y', timeHeight)
      .attr('text-anchor', 'start')
      .text('')

    curTime = gEnter.append('text')
      .attr('class', 'endtime')
      .attr('x', chartWidth / 2)
      .attr('y', timeHeight)
      .attr('text-anchor', 'middle')
      .text('')

    startTime = gEnter.append('text')
      .attr('class', 'endtime')
      .attr('x', chartWidth)
      .attr('y', timeHeight)
      .attr('text-anchor', 'end')
      .text('')
  })

  this.slideUpdate = function (x) {
    x = slideScale(x)
    gHandle.attr('cx', x)

    if (currentStream !== null) {
      Redis.wrappedAdd('slider_moved', {
        xPos: x,
        timePicked: +tScale(x)
      })

      currentStream.setStart(+tScale(x))

      if (currentStream.isPaused()) {
        currentStream.forceUpdate()
      }
    }
  }

  this.reset = function () {
    gHandle.attr('cx', chartWidth)
    playPause.attr('xlink:href', '../img/pause.png')
  }

  this.updateControls = function (now, xScale, stream) {
    currentStream = stream
    var bounds = currentStream.getStreamingBounds()

    tScale
      .range(currentStream.getStreamingBounds())

    startTime.text(moment(bounds[1]).format('hh:mm:ss'))
    curTime.text(moment(now).format('hh:mm:ss'))
    endTime.text(moment(bounds[0]).format('hh:mm:ss'))
  }

  return this
}
