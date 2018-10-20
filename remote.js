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
  var browserView = module.exports.getWebview(identifier)

  if (!browserView) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  return browserView.webContents.executeJavaScript(evalString, callback)
}
