# Changelog

## Version 3.4.1

- Fix `acceptsFirstMouse` for `SELECT` tag.

## Version 3.4.0

- `window.postMessage` now returns a Promise with the array of results from the plugin listeners. The plugin listeners can return an object or a Promise which will get executed and its result passed down.

## Version 3.3.1

- Fix typo in theme change.

## Version 3.3.0

- Add a `__skpm-light` or `__skpm-dark` class to the body depending on the Sketch's theme.

## Version 3.2.2

- Fix ghost area not draggable when no frame.

## Version 3.2.1

- Fix typo

## Version 3.2.0

- Fix some methods checking for the delegates' properties after rebuilding the window remotely.
- Add `hidesOnDeactivate` option. Whether the window is removed from the screen when Sketch becomes inactive. Default is `true`.
- Add `remembersWindowFrame` option. Whether to remember the position and the size of the window the next time. Defaults is `false`.

## Version 3.1.3

- allow windows to close on MacOS 10.15 (Thanks @robintindale)
- fix production builds using URLs containing spaces (Thanks @robintindale)

## Version 3.1.2

- Emit `uncaughtException` event if available (Sketch >=58) instead of throwing an error if there is an event listener

## Version 3.1.1

- Correctly load file URLs when prepended with `file://` (Thanks @huw)

## Version 3.1.0

- Fix the `webview.focus()` and `webview.blur()` methods not working
- Fix the webview getting stuck to cursor on draggable area (Thanks @xsfour)

## Version 3.0.7

- Fix the y coordinate of the first event of `acceptFirstClick`

## Version 3.0.6

- Fix `webContents.executeJavaScript` when the script contains some escaped double quotes

## Version 3.0.5

- Fix `remote.sendToWebview` when the inspector was opened (Thanks @ig-robstoffers)

## Version 3.0.4

- Fix `webContents.executeJavaScript`

## Version 3.0.3

- Clear the webview context when closing the webview.

## Version 3.0.2

- Fix `sendToWebview` and `fromPanel` when the vibrancy option is set.

## Version 3.0.1

- Fix hiding the background of the webview. This in turn fixes setting the vibrancy option.

## Version 3.0.0

- Add `data-app-region` to be able to drag a div to move the window.
- `executeJavascript` changed a bit: if the result of the executed code is a promise the callback result will be the resolved value of the promise. We recommend that you use the returned Promise to handle code that results in a Promise.

  ```js
  contents
    .executeJavaScript(
      'fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())',
      true
    )
    .then(result => {
      console.log(result) // Will be the JSON object from the fetch call
    })
  ```

- Fix bounds methods to handle inverted y as well as the initial y position of the window.

## Version 2.1.7

- Fix remotely executing javascript on a webview.

## Version 2.1.6

- Fix events dispatching to the wrong event emitter.

## Version 2.1.5

- Fix a bug in the 'will-navigate' event.

## Version 2.1.4

- Fix a bug preventing events to be triggered (introduced in v2.1.3).

## Version 2.1.3

- Make sure that `webContents.executeJavascript` is executed after the webview is loaded.
- Wrap event handlers in try/catch to log the error (and avoid crashing Sketch).

## Version 2.1.2

- Fix a crash when loading an https resource.

## Version 2.1.1

- Enable developer tools by setting `options.webPreferences.devTools` to true.

## Version 2.1.0

- Add support for showing the webview as a modal (aka sheet) by setting `options.modal` to `true`.

## Version 2.0.1

- Fix the loading of css/js assets from a local web page

## Version 2.0.0

:warning: This version requires Sketch >= 51.

- The webview is now backed by `WKWebview`.
- Instead of importing `sketch-module-web-view/client`, you now communicate with the plugin using `window.postMessage`.
