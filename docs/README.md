# sketch-module-web-view

A Sketch module for creating a complex UI with a webview. The API is mimicking the [BrowserWindow](https://electronjs.org/docs/api/browser-window) API of Electron.

## Installation

To use this module in your Sketch plugin you need a bundler utility like [skpm](https://github.com/skpm/skpm) and add it as a dependency:

```bash
npm install -S sketch-module-web-view
```

## Usage

```js
import BrowserWindow from 'sketch-module-web-view'

export default function() {
  const options = {
    identifier: 'unique.id',
  }

  const browserWindow = new BrowserWindow(options)

  browserWindow.loadURL('./my-screen.html')
}
```

## Documentation

* [Communicating between the Plugin and the WebView](/docs/communication-plugin-webview.md)
* [Inspecting the WebView](/docs/inspecting-the-webview.md)
* [Frameless-window](/docs/frameless-window.md)

## API References

* [Browser window](/docs/browser-window.md)
* [Web Contents](/docs/web-contents.md)

## License

MIT
