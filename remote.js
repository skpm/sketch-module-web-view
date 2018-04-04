/* globals NSThread */

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.getWebview = function getWebview(identifier) {
  return threadDictionary[identifier]
}

module.exports.isWebviewPresent = function isWebviewPresent(identifier) {
  return !!module.exports.getWebview(identifier)
}

module.exports.sendToWebview = function sendToWebview(identifier, evalString) {
  var browserView = module.exports.getWebview(identifier)

  if (!browserView) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  return browserView.webContents.executeJavaScript(evalString)
}
