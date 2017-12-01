/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSScreen WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSWidth NSHeight NSMiniaturizableWindowMask NSBackingStoreBuffered kCGDesktopWindowLevel NSWindowCollectionBehaviorCanJoinAllSpaces NSWindowCollectionBehaviorStationary NSWindowCollectionBehaviorIgnoresCycle NSToolbar context NSResizableWindowMask NSViewWidthSizable NSViewHeightSizable NSWindowFullScreenButton */

/* let's try to match the API from Electron's Browser window
(https://github.com/electron/electron/blob/master/docs/api/browser-window.md) */
var EventEmitter = require('./event-emitter')
var buildBrowserAPI = require('./browser-api')
var buildWebAPI = require('./webview-api')

var coScript = COScript.currentCOScript()

function BrowserWindow(options) {
  options = options || {}

  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var existingBrowserWindow = BrowserWindow.fromId(identifier)

  // if we already have a window opened, reuse it
  if (existingBrowserWindow) {
    return existingBrowserWindow
  }

  var browserWindow = new EventEmitter()
  browserWindow.id = identifier

  if (options.shouldKeepAround !== false) {
    // Long-running script
    coScript.setShouldKeepAround(true)
  }

  // Window size
  var width = options.width || 800
  var height = options.height || 600
  var mainScreenRect = NSScreen.screens()
    .firstObject()
    .frame()
  var cocoaBounds = NSMakeRect(
    typeof options.x !== 'undefined'
      ? options.x
      : Math.round((NSWidth(mainScreenRect) - width) / 2),
    typeof options.y !== 'undefined'
      ? options.y
      : Math.round((NSHeight(mainScreenRect) - height) / 2),
    width,
    height
  )

  var useStandardWindow = options.windowType !== 'textured'
  var styleMask = NSTitledWindowMask
  if (!useStandardWindow || options.transparent || options.frame === false) {
    styleMask = NSFullSizeContentViewWindowMask
  }
  if (options.minimizable !== false) {
    styleMask |= NSMiniaturizableWindowMask
  }
  if (options.closable !== false) {
    styleMask |= NSClosableWindowMask
  }
  if (options.resizable !== false) {
    styleMask |= NSResizableWindowMask
  }
  if (options.titleBarStyle && options.titleBarStyle !== 'default') {
    // The window without titlebar is treated the same with frameless window.
    options.frame = false
  }
  if (!useStandardWindow || options.transparent || options.frame === false) {
    styleMask |= NSTexturedBackgroundWindowMask
  }

  var panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
    cocoaBounds,
    styleMask,
    NSBackingStoreBuffered,
    true
  )

  var webView = WebView.alloc().initWithFrame(
    NSMakeRect(0, 0, options.width || 800, options.height || 600)
  )
  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)

  buildBrowserAPI(browserWindow, panel, webView)
  buildWebAPI(browserWindow, panel, webView)

  if (options.windowType === 'desktop') {
    panel.setLevel(kCGDesktopWindowLevel - 1)
    panel.setDisableKeyOrMainWindow(true)
    panel.setCollectionBehavior(
      NSWindowCollectionBehaviorCanJoinAllSpaces |
        NSWindowCollectionBehaviorStationary |
        NSWindowCollectionBehaviorIgnoresCycle
    )
  }

  if (
    typeof options.minWidth !== 'undefined' ||
    typeof options.minHeight !== 'undefined'
  ) {
    browserWindow.setMinimumSize(options.minWidth || 0, options.minHeight || 0)
  }

  if (
    typeof options.maxWidth !== 'undefined' ||
    typeof options.maxHeight !== 'undefined'
  ) {
    browserWindow.setMaximumSize(
      options.maxWidth || 10000,
      options.maxHeight || 10000
    )
  }

  if (options.focusable === false) {
    panel.setDisableKeyOrMainWindow(true)
  }

  if (options.transparent || options.frame === false) {
    panel.setTitlebarAppearsTransparent(true)
    panel.setTitleVisibility(NSWindowTitleHidden)
    panel.setOpaque(false)
  }

  if (options.titleBarStyle === 'hiddenInset') {
    panel.setTitlebarAppearsTransparent(true)
    var toolbar = NSToolbar.alloc().initWithIdentifier('titlebarStylingToolbar')
    toolbar.setShowsBaselineSeparator(false)
    panel.setToolbar(toolbar)
  }

  if (options.frame === false || !options.useContentSize) {
    browserWindow.setSize(width, height)
  }

  // TODO:
  // panel.setAcceptsFirstMouse(!!options.acceptsFirstMouse)
  // browserWindow.setAutoHideCursor(!options.disableAutoHideCursor)

  if (options.center) {
    browserWindow.center()
  }

  if (options.alwaysOnTop) {
    browserWindow.setAlwaysOnTop(true)
  }

  if (options.fullscreen) {
    browserWindow.setFullScreen(true)
  }
  browserWindow.setFullScreenable(!!options.fullscreenable)
  browserWindow.setTitle(options.title || context.plugin.name())

  browserWindow._setBackgroundColor(
    options.transparent ? NSColor.clearColor() : options.backgroundColor
  )

  if (options.hasShadow === false) {
    browserWindow.setHasShadow(false)
  }

  if (typeof options.opacity !== 'undefined') {
    browserWindow.setOpacity(options.opacity)
  }

  if (options.vibrancy) {
    browserWindow.setVibrancy(options.vibrancy)
  }

  if (options.webPreferences) {
    // TODO:
  }

  function installView() {
    // Make sure the bottom corner is rounded for non-modal windows: http://crbug.com/396264.
    // But do not enable it on OS X 10.9 for transparent window, otherwise a
    // semi-transparent frame would show.
    // if (!(transparent() && base::mac::IsOS10_9()) && !is_modal())
    //   [[window_ contentView] setWantsLayer:YES];

    var contentView = panel.contentView()

    if (options.frame !== false) {
      webView.setFrame(panel.contentView().bounds())
      contentView.addSubview(webView)
    } else {
      // In OSX 10.10, adding subviews to the root view for the NSView hierarchy
      // produces warnings. To eliminate the warnings, we resize the contentView
      // to fill the window, and add subviews to that.
      // http://crbug.com/380412
      contentView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)
      contentView.setFrame(contentView.superview().bounds())

      webView.setFrame(panel.contentView().bounds())
      contentView.addSubview(webView)

      // The fullscreen button should always be hidden for frameless window.
      panel.standardWindowButton(NSWindowFullScreenButton).setHidden(true)

      if (options.titleBarStyle && options.titleBarStyle !== 'default') {
        return
      }

      // Hide the window buttons.
      panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
      panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
      panel.standardWindowButton(NSWindowCloseButton).setHidden(true)

      // Some third-party macOS utilities check the zoom button's enabled state to
      // determine whether to show custom UI on hover, so we disable it here to
      // prevent them from doing so in a frameless app window.
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(false)
    }
  }

  installView()

  // Set maximizable state last to ensure zoom button does not get reset
  // by calls to other APIs.
  browserWindow.setMaximizable(options.maximizable !== false)

  if (options.show !== false) {
    browserWindow.show()
  }

  threadDictionary[identifier] = browserWindow

  return browserWindow
}

BrowserWindow.fromId = function (identifier) {
  var threadDictionary = NSThread.mainThread().threadDictionary()

  if (threadDictionary[identifier]) {
    browserWindow = threadDictionary[identifier]
    browserWindow.show()

    return browserWindow
  }

  return undefined
}

module.exports = BrowserWindow
