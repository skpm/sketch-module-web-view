# sketch-module-web-view

A sketch module for creating an complex UI with a webview.

## Installation

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
  onlyShowCloseButton: false,
  title: 'my ui',
  hideTitleBar: false,
  shouldKeepAround: true,
  frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
    'webView:didFinishLoadForFrame:': function (webView, webFrame) {
        context.document.showMessage('UI loaded!')
        WebUI.clear()
    }
  },
  uiDelegate: {} // https://developer.apple.com/reference/webkit/webuidelegate?language=objc
}

const webUI = new WebUI(context, 'path-in-resource-folder.html', options)
```

## Communicating with the webview

### Executing JS on the webview from the plugin

```js
const res = webUI.eval('someJSFunction()')
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
