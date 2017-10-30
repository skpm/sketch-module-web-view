# sketch-module-web-view

A Sketch module for creating a complex UI with a webview.

## Installation

To use this module in your Sketch plugin you need a bundler utility like [skpm](https://github.com/skpm/skpm) and add it as a dependency:

```bash
npm i -S sketch-module-web-view
```

## Usage

```js
import WebUI from 'sketch-module-web-view'

const options = {
  identifier: 'unique.id', // to reuse the UI
  x: 0,
  y: 0,
  width: 240,
  height: 180,
  background: NSColor.whiteColor(),
  blurredBackground: false,
  onlyShowCloseButton: false,
  title: 'My ui',
  hideTitleBar: false,
  shouldKeepAround: true,
  resizable: false,
  frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
    'webView:didFinishLoadForFrame:': function (webView, webFrame) {
      context.document.showMessage('UI loaded!')
      WebUI.clean()
    }
  },
  uiDelegate: {}, // https://developer.apple.com/reference/webkit/webuidelegate?language=objc
  onPanelClose: function () {
    // Stuff
    // return `false` to prevent closing the panel
  }
}

const webUI = new WebUI(context, require('./my-screen.html'), options)
```

## Communicating with the webview

### Executing JS on the webview from the plugin

```js
const res = webUI.eval('someJSFunction()')
```

### Executing JS on the webview from the another plugin or command

```js
import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote'

if (isWebviewPresent('unique.id')) {
  sendToWebview('unique.id', 'someJSFunction()')
}
```

### Executing JS in the plugin from the webview

On the plugin:
```js
options.handlers = {
  nativeLog: function (s) {
    context.document.showMessage(s)
  }
}
```

On the webview:
```js
import pluginCall from 'sketch-module-web-view/client'

pluginCall('nativeLog', 'Called from the webview')
```

⚠️  When using `options.handlers`, the `webView:didChangeLocationWithinPageForFrame:` method of the `frameLoadDelegate` will be overwritten.

⚠️  When calling `pluginCall`, the window.location.hash will be modified.
