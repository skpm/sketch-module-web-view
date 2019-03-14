# Opening an external link in the default browser instead of the WebView

A link with a `target="_blank"` will have no effect by default in the WebView. In order to open an external link, we will need to go through the Sketch Plugin.

To achieve that you need 2 parts:

1. In the WebView - intercept click events on a link:

```js
function interceptClickEvent(event) {
  const target = event.target.closest('a')
  if (target && target.getAttribute('target') === '_blank') {
    event.preventDefault()
    window.postMessage('externalLinkClicked', target.href)
  }
}

// listen for link click events at the document level
document.addEventListener('click', interceptClickEvent)
```

2. In the Sketch Plugin - handle the click:

```js
webview.webContent.on('externalLinkClicked', url => {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
})
```
