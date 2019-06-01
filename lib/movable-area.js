var CONSTANTS = require('./constants')

module.exports.injectScript = function(webView) {
  var source =
    '(function () {' +
    "document.addEventListener('mousedown', onMouseDown);" +
    '' +
    'function shouldDrag(target) {' +
    '  if (!target || (target.dataset || {}).appRegion === "no-drag") { return false }' +
    '  if ((target.dataset || {}).appRegion === "drag") { return true }' +
    '  return shouldDrag(target.parentElement)' +
    '};' +
    '' +
    'function onMouseDown(e) {' +
    '  if (e.button !== 0 || !shouldDrag(e.target)) { return }' +
    '  window.postMessage("' +
    CONSTANTS.START_MOVING_WINDOW +
    '");' +
    "  document.addEventListener('mouseup', onMouseUp);" +
    '};' +
    '' +
    'function onMouseUp(e) {' +
    '  window.postMessage("' +
    CONSTANTS.STOP_MOVING_WINDOW +
    '");' +
    "  document.removeEventListener('mouseup', onMouseUp);" +
    '};' +
    '' +
    '})()'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView
    .configuration()
    .userContentController()
    .addUserScript(script)
}

module.exports.setupHandler = function(browserWindow) {
  var initialMouseLocation = null
  var initialWindowPosition = null
  var timeout = null

  function stopMovingWindow() {
    initialMouseLocation = null
    initialWindowPosition = null
    clearTimeout(timeout)
  }

  function moveWindow() {
    if (!initialWindowPosition) {
      return
    }
    if (NSEvent.pressedMouseButtons() !== 1) {
      stopMovingWindow()
    } else {
      var mouse = NSEvent.mouseLocation()
      browserWindow.setPosition(
        initialWindowPosition.x + (mouse.x - initialMouseLocation.x),
        initialWindowPosition.y + (initialMouseLocation.y - mouse.y), // y is inverted
        false
      )
      timeout = setTimeout(moveWindow, 1000 / 60)
    }
  }

  browserWindow.webContents.on(CONSTANTS.START_MOVING_WINDOW, function() {
    stopMovingWindow()

    initialMouseLocation = NSEvent.mouseLocation()
    var position = browserWindow.getPosition()
    initialWindowPosition = {
      x: position[0],
      y: position[1],
    }
    timeout = setTimeout(moveWindow, 1000 / 60)
  })

  browserWindow.webContents.on(CONSTANTS.STOP_MOVING_WINDOW, stopMovingWindow)
}
