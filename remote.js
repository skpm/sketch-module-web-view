/* globals NSThread */
var BrowserWindow = require('./lib')

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.getWebview = BrowserWindow.fromId

module.exports.isWebviewPresent = function isWebviewPresent(identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview(
  identifier,
  evalString,
  callback
) {
  if (!module.exports.isWebviewPresent(identifier)) {
    return undefined
  }

  // in case there is no callback, lightweight path
  if (!callback) {
    var panel = threadDictionary[identifier]
    var webview = panel.contentView().subviews()[0]
    if (!webview || !webview.evaluateJavaScript_completionHandler) {
      throw new Error('Webview ' + identifier + ' not found')
    }

    webview.evaluateJavaScript_completionHandler(evalString, null)
    return undefined
  }

  var browserView = module.exports.getWebview(identifier)

  if (!browserView) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  return browserView.webContents.executeJavaScript(evalString, callback)
}
