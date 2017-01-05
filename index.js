/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript */
var MochaJSDelegate = require('mocha-js-delegate')

function WebUI (context, htmlName, options) {
  // ColorPicker main window
  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var panel = threadDictionary[identifier] ? threadDictionary[identifier] : NSPanel.alloc().init()

  // Window size
  panel.setFrame_display(NSMakeRect(
    options.x || 0,
    options.y || 0,
    options.width || 240,
    options.height || 180
  ), true)

  panel.setStyleMask(options.styleMask || (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask))
  panel.setBackgroundColor(options.background || NSColor.whiteColor())

  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
  }

  // Titlebar
  panel.setTitle(options.title || context.plugin.name())
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true)
  }

  panel.becomeKeyWindow()
  panel.setLevel(NSFloatingWindowLevel)

  threadDictionary[identifier] = panel

  if (options.shouldKeepAround !== false) { // Long-running script
    COScript.currentCOScript().setShouldKeepAround_(true)
  }

  // Add Web View to window
  var webView = WebView.alloc().initWithFrame(NSMakeRect(
    0,
    options.hideTitleBar ? -24 : 0,
    options.width || 240,
    (options.height || 180) - (options.hideTitleBar ? 0 : 24)
  ))

  if (options.handlers) {
    var handlers = {
      'webView:decidePolicyForNavigationAction:request:frame:decisionListener:': function (webview, actionInformation, request, frame, listener) {
        if (request.URL.scheme.isEqualToString('action')) {
          var action = request.URL.host.replace('.com', '')
          if (options.handlers[action]) {
            var args = request.URL.query && request.URL.query.replace('args=', '')
            options.handlers[action].apply(this, JSON.parse(decodeURIComponent(args)))
            listener.ignore()
            return
          }
        }
        listener.use()
      }
    }

    var policyDelegate = new MochaJSDelegate(handlers)
    webView.setPolicyDelegate_(policyDelegate.getClassInstance())
  }

  if (options.frameLoadDelegate) {
    var frameLoadDelegate = new MochaJSDelegate(options.frameLoadDelegate)
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate)
    webView.setUIDelegate_(uiDelegate.getClassInstance())
  }

  webView.setMainFrameURL_(context.plugin.urlForResourceNamed(htmlName).path())

  panel.contentView().addSubview(webView)
  panel.center()
  panel.makeKeyAndOrderFront(null)

  return {
    panel: panel,
    eval: webView.stringByEvaluatingJavaScriptFromString,
    webView: webView
  }
}

WebUI.clean = function () {
  COScript.currentCOScript().setShouldKeepAround_(false)
}

module.exports = WebUI
