# Inspecting the WebView

If your plugin is using a webview, chances are that you will need to inspect it at some point.

To do so, you need to add the preference:

```shell
defaults write com.bohemiancoding.sketch3 WebKitDeveloperExtras -bool true
```

Then you can simply right-click on your webview and click on `Inspect`. The inspector should show up.
