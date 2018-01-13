/* globals NSMutableDictionary, NSDictionary */
var ObjCClass = require('cocoascript-class').default
var EventEmitter = require('@skpm/events')
var parseQuery = require('./parseQuery')

// We create one ObjC class for ourselves here
var FrameLoadDelegateClass

// let's try to match https://github.com/electron/electron/blob/master/docs/api/web-contents.md
module.exports = function buildAPI (browserWindow, panel, webview) {
  var webContents = new EventEmitter()

  webContents.loadURL = browserWindow.loadURL
  webContents.getURL = webview.mainFrameURL
  webContents.getTitle = webview.mainFrameTitle
  webContents.isDestroyed = function () {
    // TODO:
  }
  webContents.isLoading = function () {
    return webview.loading()
  }
  webContents.stop = webview.stopLoading
  webContents.reload = webview.reload
  webContents.canGoBack = webview.canGoBack
  webContents.canGoForward = webview.canGoForward
  webContents.goBack = webview.goBack
  webContents.goForward = webview.goForward
  webContents.executeJavaScript = function (script) {
    return webview.stringByEvaluatingJavaScriptFromString(script)
  }
  webContents.undo = function () {
    webview.undoManager().undo()
  }
  webContents.redo = function () {
    webview.undoManager().redo()
  }
  webContents.cut = webview.cut
  webContents.copy = webview.copy
  webContents.paste = webview.paste
  webContents.pasteAndMatchStyle = webview.pasteAsRichText
  webContents.delete = webview.delete
  webContents.replace = webview.replaceSelectionWithText
  webContents.getNativeWebview = function () {
    return webview
  }

  if (!FrameLoadDelegateClass) {
    FrameLoadDelegateClass = ObjCClass({
      classname: 'FrameLoadDelegateClass',
      state: NSMutableDictionary.dictionaryWithDictionary({
        lastQueryId: null,
        wasReady: 0
      }),
      utils: null,

      // // Called when a client redirect is cancelled.
      // 'webView:didCancelClientRedirectForFrame:': function (
      //   webView,
      //   webFrame
      // ) {},

      // Called when the scroll position within a frame changes.
      'webView:didChangeLocationWithinPageForFrame:': function (
        webView,
        webFrame
      ) {
        var query = webView
          .windowScriptObject()
          .evaluateWebScript('window.location.hash')
        query = this.utils.parseQuery(query)
        if (
          query.pluginAction &&
          query.actionId &&
          query.actionId !== String(this.state.lastQueryId)
        ) {
          this.state.setObject_forKey(query.actionId, 'lastQueryId')
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs)
          } catch (err) {
            query.pluginArgs = []
          }
          query.pluginArgs.unshift(query.pluginAction)
          this.utils.emit.apply(this, query.pluginArgs)
        }
        this.utils.emitEvent('did-navigate-in-page', [
          {},
          webView
            .windowScriptObject()
            .evaluateWebScript('window.location.href')
        ])
      },

      // // Called when the JavaScript window object in a frame is ready for loading.
      // 'webView:didClearWindowObject:forFrame:': function (
      //   webView,
      //   windowObject,
      //   webFrame
      // ) {},

      // // Called when content starts arriving for a page load.
      // 'webView:didCommitLoadforFrame:': function (webView, webFrame) {},

      // // Notifies the delegate that a new JavaScript context has been created.
      // 'webView:didCreateJavaScriptContext:forFrame:': function (
      //   webView,
      //   context,
      //   webFrame
      // ) {

      // },

      // Called when an error occurs loading a committed data source.
      'webView:didFailLoadWithError:forFrame:': function (
        webView,
        error,
        webFrame
      ) {
        this.utils.emit('did-fail-load', error)
      },

      // Called when a page load completes.
      'webView:didFinishLoadForFrame:': function (webView, webFrame) {
        if (this.state.wasReady == 0) {
          this.utils.emitBrowserEvent('ready-to-show')
          this.state.setObject_forKey(1, 'wasReady')
        }
        this.utils.emit('did-finish-load')
        this.utils.emit('did-frame-finish-load')
        this.utils.emit('dom-ready')
      },

      // // Called when a provisional data source for a frame receives a server redirect.
      // 'webView:didReceiveServerRedirectForProvisionalLoadForFrame:': function (
      //   webView,
      //   webFrame
      // ) {
      //   this.utils.emit('did-get-redirect-request')
      // },

      // // Called when the page title of a frame loads or changes.
      // 'webView:didReceiveTitle:forFrame:': function (
      //   webView,
      //   title,
      //   webFrame
      // ) {
      //   this.utils.emitBrowserEvent('page-title-updated', {
      //     preventDefault () {
      //       // TODO: can we actually prevent it?
      //     }
      //   }, title)
      // },

      // // Called when a page load is in progress in a given frame.
      // 'webView:didStartProvisionalLoadForFrame:': function (
      //   webView,
      //   webFrame
      // ) {
      //   this.utils.emit('did-start-loading')
      // },

      // Called when a frame will be closed.
      'webView:willCloseFrame:': function (webView, webFrame) {
        this.utils.emit('will-prevent-unload', {
          preventDefault: function () {
            this.utils.close()
          }.bind(this)
        })
      }

      // // Called when a frame receives a client redirect and before it is fired.
      // 'webView:willPerformClientRedirectToURL:delay:fireDate:forFrame:': function (
      //   webView,
      //   url,
      //   delay,
      //   fireDate,
      //   webFrame
      // ) {
      //   this.utils.emit('will-navigate', {}, String(url))
      // }
    })
  }

  var frameLoadDelegate = FrameLoadDelegateClass.new()
  frameLoadDelegate.utils = NSDictionary.dictionaryWithDictionary({
    close: browserWindow.destroy,
    emitBrowserEvent: browserWindow.emit.bind(browserWindow),
    emit: webContents.emit.bind(webContents),
    parseQuery: parseQuery
  })

  webview.setFrameLoadDelegate(frameLoadDelegate)

  browserWindow.webContents = webContents
}
