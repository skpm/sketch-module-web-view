# Opening a link from WebView in a default browser

It is impossible to open a link from WebView in external browser directly.
To achieve that you need 2 parts:

1. In webview - intercept a click event on a link:

```js
function interceptClickEvent (event) {
    const target = event.target.closest('a');
    if (target && target.getAttribute('target') === '_blank') {
        event.preventDefault();
        window.postMessage('externalLinkClicked', target.href)
    }
}

// listen for link click events at the document level
document.addEventListener('click', interceptClickEvent);
```

2. In the host of the plugin - handle the opening:

```js
webview.webContent.on('externalLinkClicked', url => {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
});

```
