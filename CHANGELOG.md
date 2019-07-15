# Changelog

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
