# sketch-module-web-view

A Sketch module for creating a complex UI with a webview.

## Installation

To use this module in your Sketch plugin you need a bundler utility like [skpm](https://github.com/skpm/skpm) and add it as a dependency:

```bash
npm i -S sketch-module-web-view
```

## Usage

```js
import BrowserWindow from 'sketch-module-web-view'

export default function () {
  const options = {
    identifier: 'unique.id'
  }

  const browserWindow = new BrowserWindow(options)

  browserWindow.loadURL('./my-screen.html')
}
```

## Communicating with the webview

### Executing JS on the webview from the plugin

```js
const res = browserWindow.webContents.executeJavaScript('someJSFunction()')
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
browserWindow.webContents.on('nativeLog', function (s) {
  context.document.showMessage(s)
}
```

On the webview:
```js
import pluginCall from 'sketch-module-web-view/client'

pluginCall('nativeLog', 'Called from the webview')
```

⚠️  When calling `pluginCall`, the window.location.hash will be modified.
