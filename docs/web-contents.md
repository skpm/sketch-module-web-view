# webContents

> Render and control web pages.

`webContents` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). It is responsible for rendering and controlling a web page and is a property of the [`BrowserWindow`](browser-window.md) object. An example of accessing the `webContents` object:

```javascript
const BrowserWindow = require('sketch-module-web-view')

let win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('http://github.com')

let contents = win.webContents
console.log(contents)
```

## Class: WebContents

> Render and control the contents of a BrowserWindow instance.

### Instance Events

#### Event: 'did-finish-load'

Emitted when the navigation is done, i.e. the spinner of the tab has stopped spinning, and the `onload` event was dispatched.

#### Event: 'did-fail-load'

Returns:

- `error` Error

This event is like `did-finish-load` but emitted when the load failed or was cancelled, e.g. `window.stop()` is invoked.

#### Event: 'did-frame-finish-load'

Emitted when a frame has done navigation.

#### Event: 'did-start-loading'

Corresponds to the points in time when the spinner of the tab started spinning.

#### Event: 'did-get-redirect-request'

Emitted when a redirect is received while requesting a resource.

#### Event: 'dom-ready'

Emitted when the document in the given frame is loaded.

#### Event: 'will-navigate'

Returns:

- `event` Event
- `url` String

Emitted when a user or the page wants to start navigation. It can happen when the `window.location` object is changed or a user clicks a link in the page.

This event will not emit when the navigation is started programmatically with APIs like `webContents.loadURL` and `webContents.back`.

It is also not emitted for in-page navigations, such as clicking anchor links or updating the `window.location.hash`. Use `did-navigate-in-page` event for this purpose.

#### Event: 'did-navigate-in-page'

Returns:

- `event` Event
- `url` String

Emitted when an in-page navigation happened.

When in-page navigation happens, the page URL changes but does not cause navigation outside of the page. Examples of this occurring are when anchor links are clicked or when the DOM `hashchange` event is triggered.

### Instance Methods

#### `contents.loadURL(url)`

- `url` String

The `url` can be a remote address (e.g. `http://`) or a path to a local HTML file using the `file://` protocol.

To ensure that file URLs are properly formatted, it is recommended to use `require`.

#### `contents.getURL()`

Returns `String` - The URL of the current web page.

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('http://github.com')

let currentURL = win.webContents.getURL()
console.log(currentURL)
```

#### `contents.getTitle()`

Returns `String` - The title of the current web page.

#### `contents.isDestroyed()`

Returns `Boolean` - Whether the web page is destroyed.

#### `contents.isLoading()`

Returns `Boolean` - Whether web page is still loading resources.

#### `contents.stop()`

Stops any pending navigation.

#### `contents.reload()`

Reloads the current web page.

#### `contents.canGoBack()`

Returns `Boolean` - Whether the browser can go back to previous web page.

#### `contents.canGoForward()`

Returns `Boolean` - Whether the browser can go forward to next web page.

#### `contents.goBack()`

Makes the browser go back a web page.

#### `contents.goForward()`

Makes the browser go forward a web page.

#### `contents.executeJavaScript(code[, callback])`

- `code` String
- `callback` Function (optional) - Called after script has been executed.
  - `error` Error | null
  - `result` Any

Returns `Promise<any>` - A promise that resolves with the result of the executed code or is rejected if the result of the code is a rejected promise (or if it fails to execute the code).

Evaluates `code` in page.

If the result of the executed code is a promise the callback result will be the resolved value of the promise. We recommend that you use the returned Promise to handle code that results in a Promise.

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

#### `contents.undo()`

Executes the editing command `undo` in web page.

#### `contents.redo()`

Executes the editing command `redo` in web page.

#### `contents.cut()`

Executes the editing command `cut` in web page.

#### `contents.copy()`

Executes the editing command `copy` in web page.

#### `contents.paste()`

Executes the editing command `paste` in web page.

#### `contents.pasteAndMatchStyle()`

Executes the editing command `pasteAndMatchStyle` in web page.

#### `contents.delete()`

Executes the editing command `delete` in web page.

#### `contents.replace(text)`

- `text` String

Executes the editing command `replace` in web page.

<!--
#### `contents.showDefinitionForSelection()` _macOS_

Shows pop-up dictionary that searches the selected word on the page. -->
