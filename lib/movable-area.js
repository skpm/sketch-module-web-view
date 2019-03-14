var CONSTANTS = require('./constants')

module.exports.injectScript = function(webView) {
  var source =
    '(function () {' +
    'var animationId = null;' +
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
    '  animationId = requestAnimationFrame(moveWindow);' +
    '};' +
    '' +
    'function onMouseUp(e) {' +
    '  window.postMessage("' +
    CONSTANTS.STOP_MOVING_WINDOW +
    '");' +
    "  document.removeEventListener('mouseup', onMouseUp);" +
    '  cancelAnimationFrame(animationId);' +
    '};' +
    '' +
    'function moveWindow(e) {' +
    '  window.postMessage("' +
    CONSTANTS.MOVE_WINDOW +
    '");' +
    '  animationId = requestAnimationFrame(moveWindow);' +
    '}' +
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

  browserWindow.webContents.on(CONSTANTS.START_MOVING_WINDOW, function() {
    initialMouseLocation = NSEvent.mouseLocation()
    var position = browserWindow.getPosition()
    initialWindowPosition = {
      x: position[0],
      y: position[1],
    }
  })

  browserWindow.webContents.on(CONSTANTS.STOP_MOVING_WINDOW, function() {
    initialMouseLocation = null
    initialWindowPosition = null
  })

  browserWindow.webContents.on(CONSTANTS.MOVE_WINDOW, function() {
    if (!initialWindowPosition) {
      return
    }
    const mouse = NSEvent.mouseLocation()
    browserWindow.setPosition(
      initialWindowPosition.x + (mouse.x - initialMouseLocation.x),
      initialWindowPosition.y + (initialMouseLocation.y - mouse.y), // y is inverted
      false
    )
  })
}
