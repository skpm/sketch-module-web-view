# sketch-module-web-view

A Sketch module for creating a complex UI with a webview. The API is mimicking the [BrowserWindow](https://electronjs.org/docs/api/browser-window) API of Electron.

## Installation

To use this module in your Sketch plugin you need a bundler utility like [skpm](https://github.com/skpm/skpm) and add it as a dependency:

```bash
npm install -S sketch-module-web-view
```

You can also use the [with-webview](https://github.com/skpm/with-webview) skpm template to have a solid base to start your project with a webview:

```bash
skpm create my-plugin-name --template=skpm/with-webview
```

_The version 2.x is only compatible with Sketch >= 51. If you need compatibility with previous versions of Sketch, use the version 1.x_

## Usage

```js
import BrowserWindow from 'sketch-module-web-view'

export default function() {
  const options = {
    identifier: 'unique.id',
  }

  const browserWindow = new BrowserWindow(options)

  browserWindow.loadURL(require('./my-screen.html'))
}
```

## Documentation

- [Communicating between the Plugin and the WebView](/docs/communication-plugin-webview.md)
- [Frameless-window](/docs/frameless-window.md)
- [Opening links in browser](/docs/opening-links-in-browser.md)

## API References

- [Browser window](/docs/browser-window.md)
- [Web Contents](/docs/web-contents.md)

## License

MIT
