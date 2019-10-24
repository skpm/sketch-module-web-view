# Communicating with the webview

When creating a UI, chances are that you will need to communicate between your "frontend" (the webview) and you "backend" (the plugin running in Sketch).

## Sending a message to the WebView from your plugin command

If you want to update the UI when something changes in Sketch (when the selection changes for example), you will need to send a message to the WebView.

To do so, you need to define a global function in the WebView that you will call from the plugin.

On the WebView:

```js
window.someGlobalFunctionDefinedInTheWebview = function(arg) {
  console.log(arg)
}
```

On the plugin:

```js
browserWindow.webContents
  .executeJavaScript('someGlobalFunctionDefinedInTheWebview("hello")')
  .then(res => {
    // do something with the result
  })
```

> Note that values passed to functions within `.executeJavaScript()` must be strings. To pass an object use `JSON.stringify()`
>
> For example :
>
> ```js
> let someObject = { a: 'someValue', b: 5 }
> browserWindow.webContents
>   .executeJavaScript(
>     `someGlobalFunctionDefinedInTheWebview(${JSON.stringify(someObject)})`
>   )
>   .then(res => {
>     // do something with the result
>   })
> ```

## Sending a message to the WebView from another plugin or command

If you do not have access to the WebView instance (because it was created in another command for example), you can still send a message by using the `id` used to create the WebView.

```js
import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote'

if (isWebviewPresent('unique.id')) {
  sendToWebview('unique.id', 'someGlobalFunctionDefinedInTheWebview("hello")')
}
```

## Sending a message to the plugin from the WebView

When the user interacts with the WebView, you will probably need to communicate with your plugin. You can do so by listening to the event that the WebView will dispatch.

For example, if we wanted to log something in the plugin, we could define the `nativeLog` event.

On the plugin:

```js
var sketch = require('sketch')

browserWindow.webContents.on('nativeLog', function(s) {
  sketch.UI.message(s)

  return 'result'
})
```

On the webview:

```js
window.postMessage('nativeLog', 'Called from the webview')

// you can pass any argument that can be stringified
window.postMessage('nativeLog', {
  a: b,
})

// you can also pass multiple arguments
window.postMessage('nativeLog', 1, 2, 3)

// `window.postMessage` returns a Promis with the array of results from plugin listeners
window.postMessage('nativeLog', 'blabla').then(res => {
  // res === ['result']
})
```

##### Note

If you want to see `console.log` messages from inside your webview you can see this output from `Safari > Develop > {{Your Computer}} > {{Your Plugin}}`
