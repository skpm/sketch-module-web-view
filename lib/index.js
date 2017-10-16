/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSVisualEffectView NSAppearance NSAppearanceNameVibrantLight NSVisualEffectBlendingModeBehindWindow */
var MochaJSDelegate = require('mocha-js-delegate')
var parseQuery = require('./parseQuery')

var coScript = COScript.currentCOScript()

var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:'

function WebUI (context, frameLocation, options) {
  options = options || {}
  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var panel
  var webView

  // if we already have a panel opened, reuse it
  if (threadDictionary[identifier]) {
    panel = threadDictionary[identifier]
    panel.makeKeyAndOrderFront(null)

    var subviews = panel.contentView().subviews()
    for (var i = 0; i < subviews.length; i++) {
      if (subviews[i].isKindOfClass(WebView.class())) {
        webView = subviews[i]
      }
    }

    if (!webView) {
      throw new Error('Tried to reuse panel but couldn\'t find the webview inside')
    }

    return {
      panel: panel,
      eval: webView.stringByEvaluatingJavaScriptFromString,
      webView: webView
    }
  }

  panel = NSPanel.alloc().init()

  // Window size
  var panelWidth = options.width || 240
  var panelHeight = options.height || 180
  panel.setFrame_display(NSMakeRect(
    options.x || 0,
    options.y || 0,
    panelWidth,
    panelHeight
  ), true)

  // Titlebar
  panel.setTitle(options.title || context.plugin.name())
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true)
    panel.setTitleVisibility(NSWindowTitleHidden)
  }

  // Hide minize and zoom buttons
  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
  }

  // Close window callback
  var closeButton = panel.standardWindowButton(NSWindowCloseButton)
  closeButton.setCOSJSTargetFunction(function (sender) {
    if (options.onPanelClose) {
      var result = options.onPanelClose()
      if (result === false) {
        return
      }
    }
    panel.close()
    threadDictionary.removeObjectForKey(options.identifier)
    COScript.currentCOScript().setShouldKeepAround(false)
  })
  closeButton.setAction('callAction:')

  panel.setStyleMask(options.styleMask || (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask))
  panel.becomeKeyWindow()
  panel.setLevel(NSFloatingWindowLevel)

  // Appearance
  var backgroundColor = options.background || NSColor.whiteColor()
  panel.setBackgroundColor(backgroundColor)
  if (options.blurredBackground) {
    var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight))
    vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight))
    vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)

    // Add it to the panel
    panel.contentView().addSubview(vibrancy)
  }

  threadDictionary[identifier] = panel

  if (options.shouldKeepAround !== false) { // Long-running script
    coScript.setShouldKeepAround(true)
  }

  // Add Web View to window
  webView = WebView.alloc().initWithFrame(NSMakeRect(
    0,
    options.hideTitleBar ? -24 : 0,
    options.width || 240,
    (options.height || 180) - (options.hideTitleBar ? 0 : 24)
  ))

  if (options.frameLoadDelegate || options.handlers) {
    var handlers = options.frameLoadDelegate || {}
    if (options.handlers) {
      var lastQueryId
      handlers[LOCATION_CHANGED] = function (webview, frame) {
        var query = webview.windowScriptObject().evaluateWebScript('window.location.hash')
        query = parseQuery(query)
        if (query.pluginAction && query.actionId && query.actionId !== lastQueryId && query.pluginAction in options.handlers) {
          lastQueryId = query.actionId
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs)
          } catch (err) {}
          options.handlers[query.pluginAction].apply(context, query.pluginArgs)
        }
      }
    }
    var frameLoadDelegate = new MochaJSDelegate(handlers)
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate)
    webView.setUIDelegate_(uiDelegate.getClassInstance())
  }

  if (!options.blurredBackground) {
    webView.setOpaque(true)
    webView.setBackgroundColor(backgroundColor)
  } else {
    // Prevent it from drawing a white background
    webView.setDrawsBackground(false)
  }

  // When frameLocation is a file, prefix it with the Sketch Resources path
  if ((/^(?!http|localhost|www|file).*\.html?$/).test(frameLocation)) {
    frameLocation = context.plugin.urlForResourceNamed(frameLocation).path()
  }
  webView.setMainFrameURL_(frameLocation)

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
  coScript.setShouldKeepAround(false)
}

module.exports = WebUI
